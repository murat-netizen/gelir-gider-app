'use client'

import { useAppStore } from '@/lib/store'
import { formatCurrency, formatTRY, getCategoryInfo, cn } from '@/lib/utils'
import { CurrencyBadge } from './ui/badges'

export function RecurringPage() {
  const { recurringItems, toggleRecurringActive, exchangeRates } = useAppStore()
  
  const toTRY = (amount: number, currency: string) => {
    return amount * (exchangeRates[currency as keyof typeof exchangeRates] || 1)
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {recurringItems.map((item) => {
          const category = getCategoryInfo(item.category_id, item.type)
          const isIncome = item.type === 'income'
          const amountTRY = toTRY(item.amount, item.currency)
          
          return (
            <div 
              key={item.id} 
              className={cn(
                'bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition-all',
                !item.is_active && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div 
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
                    isIncome ? 'bg-emerald-50' : 'bg-red-50'
                  )}
                >
                  {category.icon}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{item.company_name}</span>
                    <span 
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        isIncome 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      )}
                    >
                      {isIncome ? 'Gelir' : 'Gider'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {item.frequency === 'monthly' && `Her ayın ${item.day_of_month}. günü`}
                    {item.frequency === 'weekly' && 'Her hafta'}
                    {item.frequency === 'yearly' && 'Her yıl'}
                  </div>
                  {item.notes && (
                    <div className="text-sm text-slate-400 mt-1">{item.notes}</div>
                  )}
                </div>
                
                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <div 
                    className={cn(
                      'font-bold text-xl',
                      isIncome ? 'text-emerald-600' : 'text-red-600'
                    )}
                  >
                    {formatCurrency(item.amount, item.currency)}
                  </div>
                  {item.currency !== 'TRY' && (
                    <div className="text-sm text-slate-400">
                      {formatTRY(amountTRY)}
                    </div>
                  )}
                </div>
                
                {/* Currency Badge */}
                <CurrencyBadge currency={item.currency} />
                
                {/* Toggle */}
                <label className="relative cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={() => toggleRecurringActive(item.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
            </div>
          )
        })}
        
        {recurringItems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            <p className="text-lg font-medium mb-2">Düzenli ödeme bulunamadı</p>
            <p className="text-sm">Yeni işlem eklerken "Düzenli İşlem" seçeneğini işaretleyin</p>
          </div>
        )}
      </div>
    </div>
  )
}
