import { describe, it, expect } from 'vitest';
import { parseCsv } from './csv.parser.js';

describe('parseCsv', () => {
  it('parses comma-separated English columns', () => {
    const csv = Buffer.from(
      'date,amount,description\n' +
        '2024-01-15,-50.25,Coffee shop\n' +
        '2024-01-16,2000,Salary\n',
    );
    const result = parseCsv(csv);

    expect(result.total).toBe(2);
    expect(result.skipped).toBe(0);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0]?.amount).toBe(-50.25);
    expect(result.transactions[0]?.description).toBe('Coffee shop');
    expect(result.transactions[1]?.amount).toBe(2000);
    expect(result.transactions[1]?.description).toBe('Salary');
  });

  it('parses semicolon-separated Spanish columns with European decimals', () => {
    const csv = Buffer.from(
      'Fecha;Importe;Concepto\n' +
        '15/01/2024;-50,25;Café\n' +
        '16/01/2024;2000,00;Nómina\n',
    );
    const result = parseCsv(csv);

    expect(result.total).toBe(2);
    expect(result.skipped).toBe(0);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0]?.amount).toBe(-50.25);
    expect(result.transactions[0]?.description).toBe('Café');
    expect(result.transactions[1]?.amount).toBe(2000);
    expect(result.transactions[1]?.description).toBe('Nómina');
  });

  it('skips rows with amount equal to zero', () => {
    const csv = Buffer.from(
      'date,amount,description\n' +
        '2024-01-15,0,Zero amount\n' +
        '2024-01-16,100,Real\n',
    );
    const result = parseCsv(csv);

    expect(result.total).toBe(2);
    expect(result.skipped).toBe(1);
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0]?.description).toBe('Real');
  });

  it('skips rows with an invalid date', () => {
    const csv = Buffer.from(
      'date,amount,description\n' +
        'NOT_A_DATE,100,Bad row\n' +
        '2024-01-16,50,Good row\n',
    );
    const result = parseCsv(csv);

    expect(result.total).toBe(2);
    expect(result.skipped).toBe(1);
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0]?.description).toBe('Good row');
  });

  it('returns an empty result for an empty CSV', () => {
    const result = parseCsv(Buffer.from(''));

    expect(result.transactions).toEqual([]);
    expect(result.skipped).toBe(0);
    expect(result.total).toBe(0);
  });
});
