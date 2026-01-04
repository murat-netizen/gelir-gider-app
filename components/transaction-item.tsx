'use client'

import { Edit3, Trash2, Repeat } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency, formatTRY, formatDate, getCategoryInfo, cn } from '@/lib/utils'
import { CurrencyBadge, StatusBadge } from './ui/badges'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const category = getCategoryInfo(transaction.category_id, transaction.type)
  const isIncome = transaction.type === 'income'
  
  const handleDelete = () => {
    if (confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      onDelete(transaction.id)
    }
  }
  
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div 
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
            isIncome ? 'bg-emerald-50' : 'bg-red-50'
          )}
        >
          {category.icon}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-800 truncate">
              {transaction.company_name}
            </span>
            {transaction.is_recurring && (
              <span title="Düzenli ödeme">
                <Repeat size={14} className="text-indigo-500 flex-shrink-0" />
              </span>
            )}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span style={{ color: category.color }}>{category.name}</span>
            <span>•</span>
            <span>{formatDate(transaction.transaction_date)}</span>
          </div>
        </div>
        
        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <div 
            className={cn(
              'font-bold text-lg',
              isIncome ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
          </div>
          {transaction.currency !== 'TRY' && (
            <div className="text-sm text-slate-400">
              {formatTRY(transaction.amount_try)}
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <CurrencyBadge currency={transaction.currency} />
          <StatusBadge status={transaction.status} />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button 
            onClick={() => onEdit(transaction)} 
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
            title="Düzenle"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={handleDelete} 
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
            title="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Notes */}
      {transaction.notes && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-slate-500">{transaction.notes}</p>
        </div>
      )}
    </div>
  )
}
