export type CanonicalTransaction = {
  date: Date;
  amount: number;
  currency: string;
  description: string;
  rawData?: Record<string, unknown>;
};
