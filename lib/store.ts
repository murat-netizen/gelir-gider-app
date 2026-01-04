import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, RecurringItem, Currency, TransactionFormData } from '@/types'
import { generateId, toTRY } from './utils'

// Default exchange rates
const DEFAULT_RATES: Record<Currency, number> = {
  TRY: 1,
  USD: 43.05,
  EUR: 46.80,
  GBP: 54.20,
}

// Initial demo data
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: generateId(),
    user_id: 'demo',
    type: 'income',
    company_name: 'Istanbul Care',
    amount: 6300,
    currency: 'USD',
    exchange_rate: 43.05,
    amount_try: 271215,
    category_id: 'medical',
    transaction_date: '2026-01-15',
    status: 'received',
    is_recurring: true,
    recurring_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'income',
    company_name: 'Hairport Clinic',
    amount: 3500,
    currency: 'EUR',
    exchange_rate: 46.80,
    amount_try: 163800,
    category_id: 'medical',
    transaction_date: '2026-01-10',
    status: 'received',
    is_recurring: true,
    recurring_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'income',
    company_name: 'Suzermed Clinic',
    amount: 1150,
    currency: 'EUR',
    exchange_rate: 46.80,
    amount_try: 53820,
    category_id: 'medical',
    transaction_date: '2026-01-12',
    status: 'pending',
    is_recurring: true,
    recurring_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'income',
    company_name: 'Venus Clinic',
    amount: 50000,
    currency: 'TRY',
    exchange_rate: 1,
    amount_try: 50000,
    category_id: 'medical',
    transaction_date: '2026-01-20',
    status: 'pending',
    is_recurring: true,
    recurring_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'income',
    company_name: 'Via Dental',
    amount: 25000,
    currency: 'TRY',
    exchange_rate: 1,
    amount_try: 25000,
    category_id: 'dental',
    transaction_date: '2026-01-18',
    status: 'received',
    is_recurring: true,
    recurring_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'income',
    company_name: 'Halime Maaş',
    amount: 80000,
    currency: 'TRY',
    exchange_rate: 1,
    amount_try: 80000,
    category_id: 'salary',
    transaction_date: '2026-01-01',
    status: 'received',
    is_recurring: true,
    recurring_id: '6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'expense',
    company_name: 'EV Giderleri',
    amount: 20000,
    currency: 'TRY',
    exchange_rate: 1,
    amount_try: 20000,
    category_id: 'housing',
    transaction_date: '2026-01-05',
    status: 'paid',
    is_recurring: true,
    recurring_id: '7',
    notes: 'Faturalar, telefon, pazar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'expense',
    company_name: 'Dijital Uygulamalar',
    amount: 250,
    currency: 'USD',
    exchange_rate: 43.05,
    amount_try: 10762.5,
    category_id: 'software',
    transaction_date: '2026-01-01',
    status: 'paid',
    is_recurring: true,
    recurring_id: '8',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'expense',
    company_name: 'Kişisel Harcamalar',
    amount: 20000,
    currency: 'TRY',
    exchange_rate: 1,
    amount_try: 20000,
    category_id: 'personal',
    transaction_date: '2026-01-15',
    status: 'paid',
    is_recurring: true,
    recurring_id: '9',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo',
    type: 'expense',
    company_name: 'Araç Giderleri',
    amount: 8000,
    currency: 'TRY',
    exchange_rate: 1,
    amount_try: 8000,
    category_id: 'transport',
    transaction_date: '2026-01-10',
    status: 'paid',
    is_recurring: true,
    recurring_id: '10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const INITIAL_RECURRING: RecurringItem[] = [
  { id: '1', user_id: 'demo', type: 'income', company_name: 'Istanbul Care', amount: 6300, currency: 'USD', category_id: 'medical', frequency: 'monthly', day_of_month: 15, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', type: 'income', company_name: 'Hairport Clinic', amount: 3500, currency: 'EUR', category_id: 'medical', frequency: 'monthly', day_of_month: 10, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: 'demo', type: 'income', company_name: 'Suzermed Clinic', amount: 1150, currency: 'EUR', category_id: 'medical', frequency: 'monthly', day_of_month: 12, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', user_id: 'demo', type: 'income', company_name: 'Venus Clinic', amount: 50000, currency: 'TRY', category_id: 'medical', frequency: 'monthly', day_of_month: 20, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', user_id: 'demo', type: 'income', company_name: 'Via Dental', amount: 25000, currency: 'TRY', category_id: 'dental', frequency: 'monthly', day_of_month: 18, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', user_id: 'demo', type: 'income', company_name: 'Halime Maaş', amount: 80000, currency: 'TRY', category_id: 'salary', frequency: 'monthly', day_of_month: 1, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '7', user_id: 'demo', type: 'expense', company_name: 'EV Giderleri', amount: 20000, currency: 'TRY', category_id: 'housing', frequency: 'monthly', day_of_month: 5, start_date: '2026-01-01', is_active: true, notes: 'Faturalar, telefon, pazar', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '8', user_id: 'demo', type: 'expense', company_name: 'Dijital Uygulamalar', amount: 250, currency: 'USD', category_id: 'software', frequency: 'monthly', day_of_month: 1, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '9', user_id: 'demo', type: 'expense', company_name: 'Kişisel Harcamalar', amount: 20000, currency: 'TRY', category_id: 'personal', frequency: 'monthly', day_of_month: 15, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '10', user_id: 'demo', type: 'expense', company_name: 'Araç Giderleri', amount: 8000, currency: 'TRY', category_id: 'transport', frequency: 'monthly', day_of_month: 10, start_date: '2026-01-01', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

interface AppState {
  // Data
  transactions: Transaction[]
  recurringItems: RecurringItem[]
  exchangeRates: Record<Currency, number>
  
  // UI State
  selectedMonth: number
  selectedYear: number
  filterType: 'all' | 'income' | 'expense'
  searchQuery: string
  isModalOpen: boolean
  editingTransaction: Transaction | null
  
  // Actions - Transactions
  addTransaction: (data: TransactionFormData) => void
  updateTransaction: (id: string, data: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setEditingTransaction: (transaction: Transaction | null) => void
  
  // Actions - Recurring
  addRecurringItem: (data: Partial<RecurringItem>) => void
  updateRecurringItem: (id: string, data: Partial<RecurringItem>) => void
  deleteRecurringItem: (id: string) => void
  toggleRecurringActive: (id: string) => void
  generateRecurringTransactions: (month: number, year: number) => void
  
  // Actions - Exchange Rates
  updateExchangeRate: (currency: Currency, rate: number) => void
  fetchExchangeRates: () => Promise<void>
  
  // Actions - UI
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  setFilterType: (type: 'all' | 'income' | 'expense') => void
  setSearchQuery: (query: string) => void
  setModalOpen: (open: boolean) => void
  
  // Computed
  getFilteredTransactions: () => Transaction[]
  getMonthlyTotals: () => { income: number; expense: number; net: number }
  getYearlyData: () => Array<{ month: string; income: number; expense: number; net: number }>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data
      transactions: INITIAL_TRANSACTIONS,
      recurringItems: INITIAL_RECURRING,
      exchangeRates: DEFAULT_RATES,
      
      // Initial UI State
      selectedMonth: new Date().getMonth(),
      selectedYear: 2026,
      filterType: 'all',
      searchQuery: '',
      isModalOpen: false,
      editingTransaction: null,
      
      // Transaction Actions
      addTransaction: (data) => {
        const rates = get().exchangeRates
        const exchangeRate = rates[data.currency] || 1
        const amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount
        
        const newTransaction: Transaction = {
          id: generateId(),
          user_id: 'demo',
          type: data.type,
          company_name: data.company_name,
          amount: amount,
          currency: data.currency,
          exchange_rate: exchangeRate,
          amount_try: amount * exchangeRate,
          category_id: data.category_id,
          transaction_date: data.transaction_date,
          status: data.status,
          is_recurring: data.is_recurring,
          notes: data.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }))
        
        // If recurring, add to recurring items
        if (data.is_recurring && data.frequency) {
          get().addRecurringItem({
            type: data.type,
            company_name: data.company_name,
            amount: amount,
            currency: data.currency,
            category_id: data.category_id,
            frequency: data.frequency,
            day_of_month: data.day_of_month || new Date(data.transaction_date).getDate(),
            start_date: data.transaction_date,
            is_active: true,
            notes: data.notes,
          })
        }
      },
      
      updateTransaction: (id, data) => {
        const rates = get().exchangeRates
        
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.id !== id) return t
            
            const amount = data.amount ?? t.amount
            const currency = data.currency ?? t.currency
            const exchangeRate = rates[currency] || 1
            
            return {
              ...t,
              ...data,
              exchange_rate: exchangeRate,
              amount_try: amount * exchangeRate,
              updated_at: new Date().toISOString(),
            }
          }),
        }))
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }))
      },
      
      setEditingTransaction: (transaction) => {
        set({ editingTransaction: transaction })
      },
      
      // Recurring Actions
      addRecurringItem: (data) => {
        const newItem: RecurringItem = {
          id: generateId(),
          user_id: 'demo',
          type: data.type!,
          company_name: data.company_name!,
          amount: data.amount!,
          currency: data.currency!,
          category_id: data.category_id!,
          frequency: data.frequency!,
          day_of_month: data.day_of_month,
          start_date: data.start_date!,
          is_active: data.is_active ?? true,
          notes: data.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        set((state) => ({
          recurringItems: [...state.recurringItems, newItem],
        }))
      },
      
      updateRecurringItem: (id, data) => {
        set((state) => ({
          recurringItems: state.recurringItems.map((r) =>
            r.id === id ? { ...r, ...data, updated_at: new Date().toISOString() } : r
          ),
        }))
      },
      
      deleteRecurringItem: (id) => {
        set((state) => ({
          recurringItems: state.recurringItems.filter((r) => r.id !== id),
        }))
      },
      
      toggleRecurringActive: (id) => {
        set((state) => ({
          recurringItems: state.recurringItems.map((r) =>
            r.id === id ? { ...r, is_active: !r.is_active } : r
          ),
        }))
      },
      
      generateRecurringTransactions: (month, year) => {
        const state = get()
        const rates = state.exchangeRates
        
        state.recurringItems
          .filter((r) => r.is_active)
          .forEach((recurring) => {
            // Check if already generated for this month
            const exists = state.transactions.some(
              (t) =>
                t.recurring_id === recurring.id &&
                new Date(t.transaction_date).getMonth() === month &&
                new Date(t.transaction_date).getFullYear() === year
            )
            
            if (!exists) {
              const day = recurring.day_of_month || 1
              const date = new Date(year, month, Math.min(day, 28))
              const exchangeRate = rates[recurring.currency] || 1
              
              const newTransaction: Transaction = {
                id: generateId(),
                user_id: 'demo',
                type: recurring.type,
                company_name: recurring.company_name,
                amount: recurring.amount,
                currency: recurring.currency,
                exchange_rate: exchangeRate,
                amount_try: recurring.amount * exchangeRate,
                category_id: recurring.category_id,
                transaction_date: date.toISOString().split('T')[0],
                status: 'pending',
                is_recurring: true,
                recurring_id: recurring.id,
                notes: recurring.notes,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
              
              set((state) => ({
                transactions: [...state.transactions, newTransaction],
              }))
            }
          })
      },
      
      // Exchange Rate Actions
      updateExchangeRate: (currency, rate) => {
        set((state) => ({
          exchangeRates: { ...state.exchangeRates, [currency]: rate },
        }))
        
        // Recalculate all transactions with new rate
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.currency !== currency) return t
            return {
              ...t,
              exchange_rate: rate,
              amount_try: t.amount * rate,
            }
          }),
        }))
      },
      
      fetchExchangeRates: async () => {
        try {
          // In production, fetch from API
          // For now, use default rates
          console.log('Fetching exchange rates...')
        } catch (error) {
          console.error('Failed to fetch exchange rates:', error)
        }
      },
      
      // UI Actions
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedYear: (year) => set({ selectedYear: year }),
      setFilterType: (type) => set({ filterType: type }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setModalOpen: (open) => set({ isModalOpen: open }),
      
      // Computed
      getFilteredTransactions: () => {
        const state = get()
        return state.transactions.filter((t) => {
          const date = new Date(t.transaction_date)
          if (date.getMonth() !== state.selectedMonth) return false
          if (date.getFullYear() !== state.selectedYear) return false
          if (state.filterType !== 'all' && t.type !== state.filterType) return false
          if (state.searchQuery && !t.company_name.toLowerCase().includes(state.searchQuery.toLowerCase())) return false
          return true
        })
      },
      
      getMonthlyTotals: () => {
        const transactions = get().getFilteredTransactions()
        const income = transactions
          .filter((t) => t.type === 'income' && t.status !== 'cancelled')
          .reduce((sum, t) => sum + t.amount_try, 0)
        const expense = transactions
          .filter((t) => t.type === 'expense' && t.status !== 'cancelled')
          .reduce((sum, t) => sum + t.amount_try, 0)
        return { income, expense, net: income - expense }
      },
      
      getYearlyData: () => {
        const state = get()
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
        
        return months.map((month, idx) => {
          const monthTransactions = state.transactions.filter((t) => {
            const date = new Date(t.transaction_date)
            return date.getMonth() === idx && date.getFullYear() === state.selectedYear
          })
          
          const income = monthTransactions
            .filter((t) => t.type === 'income' && t.status !== 'cancelled')
            .reduce((sum, t) => sum + t.amount_try, 0)
          const expense = monthTransactions
            .filter((t) => t.type === 'expense' && t.status !== 'cancelled')
            .reduce((sum, t) => sum + t.amount_try, 0)
          
          return { month, income, expense, net: income - expense }
        })
      },
    }),
    {
      name: 'gelir-gider-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        recurringItems: state.recurringItems,
        exchangeRates: state.exchangeRates,
      }),
    }
  )
)
