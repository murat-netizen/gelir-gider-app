'use client'

import { Search, List } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TransactionItem } from './transaction-item'
import { Transaction } from '@/types'

interface TransactionsPageProps {
  onEditTransaction: (transaction: Transaction) => void
}

export function TransactionsPage({ onEditTransaction }: TransactionsPageProps) {
  const {
    getFilteredTransactions,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    deleteTransaction,
  } = useAppStore()
  
  const transactions = getFilteredTransactions()
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'income', label: 'Gelirler' },
            { id: 'expense', label: 'Giderler' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as 'all' | 'income' | 'expense')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filterType === filter.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 relative min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İşlem ara..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEditTransaction}
            onDelete={deleteTransaction}
          />
        ))}
        
        {transactions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            <List size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">İşlem bulunamadı</p>
            <p className="text-sm">Yeni işlem eklemek için butona tıklayın</p>
          </div>
        )}
      </div>
    </div>
  )
}
