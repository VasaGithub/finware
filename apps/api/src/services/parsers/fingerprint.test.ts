import { describe, it, expect } from 'vitest';
import { generateFingerprint } from './fingerprint.js';

describe('generateFingerprint', () => {
  const date = new Date('2024-01-15T00:00:00.000Z');

  it('is deterministic for the same input', () => {
    const a = generateFingerprint(date, -50.25, 'Coffee shop');
    const b = generateFingerprint(date, -50.25, 'Coffee shop');
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it('differs when the amount differs', () => {
    const a = generateFingerprint(date, -50.25, 'Coffee shop');
    const b = generateFingerprint(date, -50.26, 'Coffee shop');
    expect(a).not.toBe(b);
  });

  it('ignores surrounding whitespace and case in the description', () => {
    const a = generateFingerprint(date, -50.25, 'Coffee Shop');
    const b = generateFingerprint(date, -50.25, '  COFFEE SHOP  ');
    expect(a).toBe(b);
  });
});
