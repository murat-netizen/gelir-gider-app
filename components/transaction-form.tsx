'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Repeat } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn, formatTRY, DEFAULT_CATEGORIES, getTodayISO } from '@/lib/utils'
import { Transaction, TransactionFormData, Currency, TransactionStatus, TransactionType, Frequency } from '@/types'

interface TransactionFormProps {
  transaction?: Transaction | null
  onClose: () => void
}

const initialFormData: TransactionFormData = {
  type: 'income',
  company_name: '',
  amount: '',
  currency: 'TRY',
  category_id: '',
  transaction_date: getTodayISO(),
  status: 'pending',
  is_recurring: false,
  frequency: 'monthly',
  day_of_month: 1,
  notes: '',
}

export function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const { addTransaction, updateTransaction, exchangeRates } = useAppStore()
  
  const [form, setForm] = useState<TransactionFormData>(() => {
    if (transaction) {
      return {
        type: transaction.type,
        company_name: transaction.company_name,
        amount: transaction.amount,
        currency: transaction.currency,
        category_id: transaction.category_id,
        transaction_date: transaction.transaction_date,
        status: transaction.status,
        is_recurring: transaction.is_recurring,
        frequency: 'monthly',
        day_of_month: new Date(transaction.transaction_date).getDate(),
        notes: transaction.notes || '',
      }
    }
    return initialFormData
  })
  
  const categories = DEFAULT_CATEGORIES[form.type] || []
  const rate = exchangeRates[form.currency] || 1
  const amountNum = typeof form.amount === 'string' ? parseFloat(form.amount) || 0 : form.amount
  const amountTRY = amountNum * rate
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (transaction) {
      updateTransaction(transaction.id, {
        type: form.type,
        company_name: form.company_name,
        amount: amountNum,
        currency: form.currency,
        category_id: form.category_id,
        transaction_date: form.transaction_date,
        status: form.status,
        is_recurring: form.is_recurring,
        notes: form.notes,
      })
    } else {
      addTransaction(form)
    }
    
    onClose()
  }
  
  const updateField = <K extends keyof TransactionFormData>(
    field: K,
    value: TransactionFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type Toggle */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => updateField('type', 'income')}
          className={cn(
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            form.type === 'income'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'text-slate-600 hover:bg-slate-200'
          )}
        >
          <TrendingUp size={18} />
          Gelir
        </button>
        <button
          type="button"
          onClick={() => updateField('type', 'expense')}
          className={cn(
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            form.type === 'expense'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'text-slate-600 hover:bg-slate-200'
          )}
        >
          <TrendingDown size={18} />
          Gider
        </button>
      </div>
      
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Şirket / Kaynak
        </label>
        <input
          type="text"
          value={form.company_name}
          onChange={(e) => updateField('company_name', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Örn: Istanbul Care"
          required
        />
      </div>
      
      {/* Amount & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tutar
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Para Birimi
          </label>
          <select
            value={form.currency}
            onChange={(e) => updateField('currency', e.target.value as Currency)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option value="TRY">🇹🇷 TRY</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
          </select>
        </div>
      </div>
      
      {/* TRY Equivalent */}
      {amountNum > 0 && form.currency !== 'TRY' && (
        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
          <span className="text-slate-600">TRY Karşılığı (Kur: {rate.toFixed(2)})</span>
          <span className="font-bold text-lg text-slate-800">{formatTRY(amountTRY)}</span>
        </div>
      )}
      
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kategori
        </label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateField('category_id', cat.id)}
              className={cn(
                'p-3 rounded-xl border-2 transition-all text-center',
                form.category_id === cat.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-100 hover:border-slate-200'
              )}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs text-slate-600 truncate">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Date & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tarih
          </label>
          <input
            type="date"
            value={form.transaction_date}
            onChange={(e) => updateField('transaction_date', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Durum
          </label>
          <select
            value={form.status}
            onChange={(e) => updateField('status', e.target.value as TransactionStatus)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
          >
            <option value="pending">⏳ Bekliyor</option>
            <option value={form.type === 'income' ? 'received' : 'paid'}>
              ✅ {form.type === 'income' ? 'Alındı' : 'Ödendi'}
            </option>
            <option value="cancelled">❌ İptal</option>
          </select>
        </div>
      </div>
      
      {/* Recurring Toggle */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <Repeat size={20} className="text-indigo-600" />
            <div>
              <div className="font-medium text-slate-800">Düzenli İşlem</div>
              <div className="text-sm text-slate-500">Her ay otomatik eklensin</div>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={form.is_recurring}
              onChange={(e) => updateField('is_recurring', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
          </div>
        </label>
        
        {form.is_recurring && (
          <div className="mt-4 pt-4 border-t border-indigo-100 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sıklık
              </label>
              <select
                value={form.frequency}
                onChange={(e) => updateField('frequency', e.target.value as Frequency)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="monthly">Aylık</option>
                <option value="weekly">Haftalık</option>
                <option value="yearly">Yıllık</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ayın Günü
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={form.day_of_month}
                onChange={(e) => updateField('day_of_month', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notlar (Opsiyonel)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          rows={2}
          placeholder="Ek notlar..."
        />
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all',
            form.type === 'income'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30'
              : 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg hover:shadow-red-500/30'
          )}
        >
          {transaction ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}
