import { describe, it, expect } from 'vitest';
import { cn, formatPrice, slugify, truncate } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns empty string for all falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces', () => {
    expect(slugify('Soy Mestiza')).toBe('soy-mestiza');
  });

  it('strips accents', () => {
    expect(slugify('Viñedos del Norte')).toBe('vinedos-del-norte');
  });

  it('removes special characters', () => {
    expect(slugify('Café & Bar!')).toBe('cafe-bar');
  });

  it('collapses multiple dashes', () => {
    expect(slugify('foo   bar---baz')).toBe('foo-bar-baz');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats centavos as ARS', () => {
    // 250000 centavos = ARS 2.500
    const result = formatPrice(250000);
    expect(result).toContain('2');
    expect(result).toContain('500');
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });
});

describe('truncate', () => {
  it('returns string unchanged if short enough', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});
