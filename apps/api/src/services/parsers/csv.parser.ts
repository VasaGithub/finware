import Papa from 'papaparse';
import type { CanonicalTransaction } from '@finware/shared';

export type CsvParseResult = {
  transactions: CanonicalTransaction[];
  skipped: number;
  total: number;
};

const DATE_KEYS = ['fecha', 'date'];
const DESC_KEYS = ['concepto', 'descripcion', 'descripción', 'description', 'detalle'];
const AMOUNT_KEYS = ['importe', 'amount', 'monto'];
const DEBIT_KEYS = ['debe'];
const CREDIT_KEYS = ['haber'];
const CURRENCY_KEYS = ['moneda', 'currency', 'divisa'];

function findValue(row: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of Object.keys(row)) {
    if (keys.includes(key.toLowerCase().trim())) {
      const value = row[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }
  }
  return undefined;
}

function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/)[0] ?? '';
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  return semicolons > commas ? ';' : ',';
}

function parseDate(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const match = /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})$/.exec(trimmed);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    let year = Number(match[3]);
    if (year < 100) year += 2000;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(Date.UTC(year, month - 1, day));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^\d.,\-]/g, '').trim();
  if (!cleaned) return NaN;

  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  let normalized: string;

  if (lastDot > -1 && lastComma > -1) {
    if (lastComma > lastDot) {
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (lastComma > -1) {
    normalized = cleaned.replace(',', '.');
  } else {
    normalized = cleaned;
  }

  return Number(normalized);
}

export function parseCsv(buffer: Buffer): CsvParseResult {
  const text = buffer.toString('utf-8').trim();
  if (!text) {
    return { transactions: [], skipped: 0, total: 0 };
  }

  const delimiter = detectDelimiter(text);
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    delimiter,
    skipEmptyLines: true,
  });

  const rows = parsed.data;
  const transactions: CanonicalTransaction[] = [];
  let skipped = 0;

  for (const row of rows) {
    const dateRaw = findValue(row, DATE_KEYS);
    const descRaw = findValue(row, DESC_KEYS);
    const amountRaw = findValue(row, AMOUNT_KEYS);
    const debitRaw = findValue(row, DEBIT_KEYS);
    const creditRaw = findValue(row, CREDIT_KEYS);
    const currencyRaw = findValue(row, CURRENCY_KEYS);

    const date = dateRaw !== undefined ? parseDate(dateRaw) : null;

    let amount: number;
    if (amountRaw !== undefined) {
      amount = parseAmount(amountRaw);
    } else if (debitRaw !== undefined || creditRaw !== undefined) {
      const debit = debitRaw !== undefined ? parseAmount(debitRaw) : 0;
      const credit = creditRaw !== undefined ? parseAmount(creditRaw) : 0;
      const safeDebit = Number.isNaN(debit) ? 0 : debit;
      const safeCredit = Number.isNaN(credit) ? 0 : credit;
      amount = safeCredit - safeDebit;
    } else {
      amount = NaN;
    }

    if (date === null || Number.isNaN(amount) || amount === 0) {
      skipped += 1;
      continue;
    }

    transactions.push({
      date,
      amount,
      currency: (currencyRaw ?? 'EUR').trim() || 'EUR',
      description: (descRaw ?? '').trim(),
      rawData: row,
    });
  }

  return { transactions, skipped, total: rows.length };
}
