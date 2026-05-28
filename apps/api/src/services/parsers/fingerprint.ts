import { createHash } from 'node:crypto';

export function generateFingerprint(
  date: Date,
  amount: number,
  description: string,
): string {
  const input = `${date.toISOString()}|${amount}|${description.trim().toLowerCase()}`;
  return createHash('sha256').update(input).digest('hex');
}
