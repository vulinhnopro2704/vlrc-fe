/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';

const extensions = ['', '.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs'];

function resolveStylexFile(importPath: string, sourceFilePath: string): string | null {
  const require = createRequire(sourceFilePath);

  for (const extension of extensions) {
    try {
      return require.resolve(importPath + extension);
    } catch {
      // Try the next supported extension.
    }
  }

  return null;
}

function getCanonicalFilePath(filePath: string): string {
  let directory = dirname(filePath);
  while (true) {
    const manifest = join(directory, 'package.json');
    if (existsSync(manifest)) {
      const { name } = JSON.parse(readFileSync(manifest, 'utf8')) as { name?: string };
      if (name) {
        const packagePath = relative(directory, filePath).split(sep).join('/');
        // Published ESM and CJS tokens keep the same hash as the library source.
        if (
          name === '@vlrc-fe/components' &&
          /^dist\/theme\/tokens\.stylex\.[cm]?js$/.test(packagePath)
        ) {
          return `${name}:src/theme/tokens.stylex.ts`;
        }
        return `${name}:${packagePath}`;
      }
    }
    const parent = dirname(directory);
    if (parent === directory) return filePath;
    directory = parent;
  }
}

/** StyleX compiler options for a Vite app consuming the precompiled components. */
export function vlrcStylexOptions(rootDir: string) {
  return {
    useCSSLayers: { before: ['reset', 'astryx-base', 'astryx-theme', 'vlrc', 'product'] },
    unstable_moduleResolution: {
      type: 'custom' as const,
      filePathResolver: (importPath: string, sourceFilePath: string) =>
        resolveStylexFile(importPath, resolve(rootDir, sourceFilePath)),
      getCanonicalFilePath,
    },
  };
}
