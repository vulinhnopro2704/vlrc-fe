#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { VLRC_COMPONENTS, formatComponentDoc, formatComponentJson } from './registry.mjs';

const cliPath = fileURLToPath(import.meta.resolve('@astryxdesign/cli'));
const args = process.argv.slice(2);

function runAstryxCLI(customArgs = args) {
  const child = spawn(process.execPath, [cliPath, ...customArgs], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

// 1. Handle `vlrc component <Name> [--json] [--props]`
if (args[0] === 'component') {
  const isJson = args.includes('--json');
  const isPropsOnly = args.includes('--props');
  const isList = args.includes('--list') || args.length === 1;

  if (isList) {
    // Print combined list
    const child = spawn(process.execPath, [cliPath, 'component', '--list'], {
      stdio: ['inherit', 'pipe', 'inherit'],
      env: process.env,
    });

    let output = '';
    child.stdout.on('data', (d) => {
      output += d.toString();
    });

    child.on('exit', (code) => {
      if (output) process.stdout.write(output);
      // Append VLRC & Richtext components
      console.log('\nVLRC Enterprise Extensions & Richtext:\n');
      for (const comp of Object.values(VLRC_COMPONENTS)) {
        console.log(`name:   ${comp.name}`);
        console.log(`import: ${comp.package}`);
        console.log('');
      }
      process.exit(code ?? 0);
    });
  } else {
    // Find target component name
    const targetName = args.find((a) => !a.startsWith('-') && a !== 'component');

    if (targetName) {
      // Check our registry first (exact or case-insensitive)
      const matchedKey = Object.keys(VLRC_COMPONENTS).find(
        (k) => k.toLowerCase() === targetName.toLowerCase(),
      );

      if (matchedKey) {
        const comp = VLRC_COMPONENTS[matchedKey];
        if (isJson) {
          console.log(formatComponentJson(comp));
        } else if (isPropsOnly) {
          console.log(formatComponentDoc(comp, { propsOnly: true }));
        } else {
          console.log(formatComponentDoc(comp));
        }
        process.exit(0);
      }
    }

    // Otherwise delegate to Astryx CLI (for Button, Dialog, etc.)
    runAstryxCLI();
  }
} else if (args[0] === 'search') {
  // 2. Handle `vlrc search <query>`
  const query = args
    .slice(1)
    .filter((a) => !a.startsWith('-'))
    .join(' ')
    .toLowerCase();
  const isJson = args.includes('--json');

  if (query) {
    const matches = Object.values(VLRC_COMPONENTS).filter((c) => {
      return (
        c.name.toLowerCase().includes(query) ||
        c.displayName.toLowerCase().includes(query) ||
        c.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
        c.description.toLowerCase().includes(query)
      );
    });

    if (matches.length > 0 && !isJson) {
      console.log(`\nFound ${matches.length} matching VLRC component(s):\n`);
      for (const m of matches) {
        console.log(`name:        ${m.name}`);
        console.log(`package:     ${m.package}`);
        console.log(`command:     npx vlrc component ${m.name}`);
        console.log(`description: ${m.description.slice(0, 100)}...`);
        console.log('');
      }
    }
  }

  runAstryxCLI();
} else {
  // Delegate all other commands
  runAstryxCLI();
}
