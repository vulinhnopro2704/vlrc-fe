#!/usr/bin/env node
/**
 * Post-build safety check: fail the build if any published dist file imports
 * `@stylexjs/stylex` and contains a LOCAL binding (function, parameter,
 * variable, class, catch) whose name shadows the stylex import binding.
 *
 * Why this exists (regression guard, added for the v3.0.3 FormFileUpload bug):
 * `@stylexjs/babel-plugin` — which consumers run over our dist when they add
 * the package to `transpilePackages` while their app uses StyleX (e.g. Next.js)
 * — rewrites call expressions by matching the callee name against the file's
 * stylex import binding WITHOUT scope analysis. A local binding that shadows
 * the import (e.g. `function s()` under `import * as s from "@stylexjs/stylex"`,
 * a byproduct of identifier minification) causes every direct call to that
 * local to be erased into `""` — silently breaking runtime behavior
 * (FormFileUpload delete / "Clear all" stopped re-rendering in v3.0.3).
 *
 * The library build therefore ships with `build.minify: false` so identifiers
 * keep their source-level names and the stylex binding stays `stylex` (a name
 * the minifier would never assign to a local). This check is the backstop:
 * it fails the build if a source-level local ever shadows the stylex import
 * binding, in any dist file, in either the ESM or CJS output.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import * as traverseNs from '@babel/traverse';

// @babel/traverse is CJS; its export shape varies by version/interop
// (function export, or an exports object carrying the function in `.default`).
const traverseDefault = traverseNs.default;
const traverse =
  (typeof traverseDefault === 'function' && traverseDefault) ||
  (traverseDefault && typeof traverseDefault.default === 'function' && traverseDefault.default) ||
  (typeof traverseNs === 'function' && traverseNs);
if (typeof traverse !== 'function') {
  throw new Error('Could not resolve the @babel/traverse function from its ESM interop shape');
}

const STYLEX_SPECIFIER = '@stylexjs/stylex';

/**
 * Analyze one file of plain JS (ESM or CJS).
 *
 * @param {string} code
 * @param {'module' | 'script'} [sourceType]
 * @returns {{
 *   stylexBindings: string[],
 *   findings: Array<{ name: string; line: number | null; kind: string }>,
 * }}
 */
export function analyze(code, sourceType = 'module') {
  const ast = parse(code, { sourceType, allowReturnOutsideFunction: true });

  // 1. Collect the binding name(s) used for the stylex import in this file.
  const stylexNames = new Set();
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value !== STYLEX_SPECIFIER) return;
      for (const spec of path.node.specifiers) {
        stylexNames.add(spec.local.name);
      }
    },
    VariableDeclarator(path) {
      // CJS: `var s = require("@stylexjs/stylex")` (rollup CJS output shape).
      const init = path.node.init;
      if (
        init?.type === 'CallExpression' &&
        init.callee.type === 'Identifier' &&
        init.callee.name === 'require' &&
        init.arguments.length === 1 &&
        init.arguments[0].type === 'StringLiteral' &&
        init.arguments[0].value === STYLEX_SPECIFIER
      ) {
        if (path.node.id.type === 'Identifier') {
          stylexNames.add(path.node.id.name);
        }
      }
    },
  });

  if (stylexNames.size === 0) {
    return { stylexBindings: [], findings: [] };
  }

  // 2. Walk every non-module scope and report local bindings that shadow it.
  const findings = [];
  const visitedScopes = new Set();
  traverse(ast, {
    enter(path) {
      if (!path.isScope() || path.isProgram()) return;
      const scope = path.scope;
      if (visitedScopes.has(scope)) return;
      visitedScopes.add(scope);
      for (const name of Object.keys(scope.bindings)) {
        if (!stylexNames.has(name)) continue;
        const binding = scope.bindings[name];
        const node = binding.path.node;
        findings.push({
          name,
          line: node.loc?.start.line ?? null,
          kind: binding.path.type,
        });
      }
    },
  });

  return { stylexBindings: [...stylexNames], findings };
}

function collectDistFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectDistFiles(full, out);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.cjs')) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const distDir = process.argv[2] ?? join(here, '..', 'dist');

  const files = collectDistFiles(distDir);
  const violations = [];
  for (const file of files) {
    const code = readFileSync(file, 'utf8');
    const sourceType = file.endsWith('.cjs') ? 'script' : 'module';
    let result;
    try {
      result = analyze(code, sourceType);
    } catch (error) {
      console.error(`✖ ${file}: could not parse — ${error.message}`);
      process.exit(1);
    }
    for (const finding of result.findings) {
      violations.push({ file, finding });
    }
  }

  if (violations.length === 0) {
    console.log(`✔ stylex-shadowing check: ${files.length} dist files clean`);
    return;
  }

  console.error('✖ stylex-shadowing check FAILED');
  for (const { file, finding } of violations) {
    const where = finding.line != null ? `:${finding.line}` : '';
    console.error(
      `  ${file}${where} — local ${finding.kind} "${finding.name}" shadows the stylex import binding`,
    );
  }
  console.error(
    '\n  Consumers that run @stylexjs/babel-plugin over this dist (e.g. Next.js\n' +
      '  transpilePackages with StyleX) erase direct calls to shadowed names.\n' +
      '  Rename the local binding — never use a name that collides with the stylex\n' +
      '  import binding — and keep build.minify: false so identifiers stay long.\n',
  );
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
