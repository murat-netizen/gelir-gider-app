export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'pending' | 'received' | 'paid' | 'cancelled';

export type Frequency = 'weekly' | 'monthly' | 'yearly';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  user_id?: string;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  company_name: string;
  amount: number;
  currency: Currency;
  exchange_rate: number;
  amount_try: number;
  category_id: string;
  transaction_date: string;
  status: TransactionStatus;
  is_recurring: boolean;
  recurring_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringItem {
  id: string;
  user_id: string;
  type: TransactionType;
  company_name: string;
  amount: number;
  currency: Currency;
  category_id: string;
  frequency: Frequency;
  day_of_month?: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  last_generated?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExchangeRate {
  currency_from: Currency;
  currency_to: Currency;
  rate: number;
  fetched_at: string;
}

export interface MonthlySummary {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_income: number;
  total_expense: number;
  net_profit: number;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  company_name?: string;
  default_currency: Currency;
  auto_update_rates: boolean;
  created_at: string;
  updated_at: string;
}

// Form types
export interface TransactionFormData {
  type: TransactionType;
  company_name: string;
  amount: number | string;
  currency: Currency;
  category_id: string;
  transaction_date: string;
  status: TransactionStatus;
  is_recurring: boolean;
  frequency?: Frequency;
  day_of_month?: number;
  notes?: string;
}
