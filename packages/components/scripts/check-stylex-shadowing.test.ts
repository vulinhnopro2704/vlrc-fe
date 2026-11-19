import { describe, expect, it } from 'vitest';
import { analyze } from './check-stylex-shadowing.mjs';

describe('analyze (stylex shadowing check)', () => {
  it('detects a local function shadowing the stylex namespace import (ESM)', () => {
    const result = analyze(
      [
        'import * as s from "@stylexjs/stylex";',
        'function make() {',
        '  let a = 1;',
        '  function s() { a = 0; }',
        '  return { dispatch: (e) => { a = e, s(); } };',
        '}',
      ].join('\n'),
    );
    expect(result.stylexBindings).toEqual(['s']);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].name).toBe('s');
  });

  it('detects a destructured parameter shadowing the stylex import', () => {
    const result = analyze(
      [
        'import * as s from "@stylexjs/stylex";',
        'function F({ uploadHandler: s }) {',
        '  return s && s(1);',
        '}',
      ].join('\n'),
    );
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].name).toBe('s');
  });

  it('detects shadowing in CJS output (require binding)', () => {
    const result = analyze(
      [
        '"use client";',
        'var s = require("@stylexjs/stylex");',
        'function make() {',
        '  function s() {}',
        '  s();',
        '}',
      ].join('\n'),
      'script',
    );
    expect(result.stylexBindings).toEqual(['s']);
    expect(result.findings).toHaveLength(1);
  });

  it('passes a file that imports stylex without shadowing', () => {
    const result = analyze(
      [
        'import * as stylex from "@stylexjs/stylex";',
        'const styles = stylex.create({ root: { display: "flex" } });',
        'function notify() {',
        '  styles;',
        '}',
      ].join('\n'),
    );
    expect(result.stylexBindings).toEqual(['stylex']);
    expect(result.findings).toHaveLength(0);
  });

  it('passes a file with shadowing that does not import stylex', () => {
    const result = analyze('function s() {} s();');
    expect(result.stylexBindings).toHaveLength(0);
    expect(result.findings).toHaveLength(0);
  });

  it('does not flag same-name bindings in sibling scopes that do not overlap', () => {
    // Two disjoint functions may each declare "notify" — only a collision with
    // the STYLEX binding name is a problem.
    const result = analyze(
      [
        'import * as stylex from "@stylexjs/stylex";',
        'function a() { function notify() {} notify(); }',
        'function b() { function notify() {} notify(); }',
      ].join('\n'),
    );
    expect(result.findings).toHaveLength(0);
  });

  it('reports the line number of the shadowing binding', () => {
    const code = [
      'import * as s from "@stylexjs/stylex";',
      'function make() {',
      '  let a = 1;',
      '  function s() { a = 0; }',
      '}',
    ].join('\n');
    const result = analyze(code);
    expect(result.findings[0].line).toBe(4);
  });
});
