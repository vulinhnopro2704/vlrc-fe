import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== 'node_modules' &&
        entry.name !== 'dist' &&
        entry.name !== '__snapshots__'
      ) {
        files.push(...collectSourceFiles(fullPath));
      }
    } else if (
      (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) &&
      !entry.name.endsWith('.test.tsx') &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.stories.tsx')
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceFiles = collectSourceFiles(join(__dirname, '../src'));

describe('Design System Conventions & Anti-Pattern Prevention', () => {
  it('should not contain redundant as="span" on components (Text defaults to span)', () => {
    const violations: string[] = [];
    const pattern = /as=["']span["']/g;

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      if (pattern.test(content)) {
        violations.push(file);
      }
    }

    expect(
      violations,
      `Found redundant as="span" in: \n${violations.join('\n')}\nHint: <Text> already defaults to <span>. For inline text, use <Text> directly instead of <Box as="span">.`,
    ).toHaveLength(0);
  });

  it('should not use <Text as="p"> (use <Paragraph> instead)', () => {
    const violations: string[] = [];
    const pattern = /<Text\b[^>]*\bas=["']p["']/g;

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      if (pattern.test(content)) {
        violations.push(file);
      }
    }

    expect(
      violations,
      `Found <Text as="p"> in: \n${violations.join('\n')}\nHint: Use <Paragraph> from @vlrc-fe/components/Typography instead.`,
    ).toHaveLength(0);
  });

  it('should not use <Text as="h1" ... h6"> (use <Title level={...}> instead)', () => {
    const violations: string[] = [];
    const pattern = /<Text\b[^>]*\bas=["']h[1-6]["']/g;

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      if (pattern.test(content)) {
        violations.push(file);
      }
    }

    expect(
      violations,
      `Found <Text as="h1-6"> in: \n${violations.join('\n')}\nHint: Use <Title level={1-6}> from @vlrc-fe/components/Typography instead.`,
    ).toHaveLength(0);
  });

  it('should not use <span role="button"> or raw <button> for interactive controls', () => {
    const violations: string[] = [];
    const spanButtonPattern = /<span\b[^>]*\brole=["']button["']/g;

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      if (spanButtonPattern.test(content)) {
        violations.push(file);
      }
    }

    expect(
      violations,
      `Found <span role="button"> in: \n${violations.join('\n')}\nHint: Use <Button variant="..."> from @vlrc-fe/components instead.`,
    ).toHaveLength(0);
  });

  it('should use modern clipPath for visually hidden srOnly styles (no deprecated rect clipping)', () => {
    const violations: string[] = [];
    const deprecatedClipPattern = /rect\(0,\s*0,\s*0,\s*0\)/g;

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      if (deprecatedClipPattern.test(content)) {
        violations.push(file);
      }
    }

    expect(
      violations,
      `Found deprecated clip: 'rect(0, 0, 0, 0)' in: \n${violations.join('\n')}\nHint: Use clipPath: 'inset(50%)' for modern CSS accessibility compliance.`,
    ).toHaveLength(0);
  });
});
