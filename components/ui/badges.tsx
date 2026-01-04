'use client'

import { Check, Clock, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Currency, TransactionStatus } from '@/types'

// Currency Badge
interface CurrencyBadgeProps {
  currency: Currency
  size?: 'sm' | 'md'
}

const CURRENCY_COLORS: Record<Currency, string> = {
  TRY: 'bg-red-500',
  USD: 'bg-green-500',
  EUR: 'bg-blue-500',
  GBP: 'bg-purple-500',
}

export function CurrencyBadge({ currency, size = 'md' }: CurrencyBadgeProps) {
  return (
    <span 
      className={cn(
        'text-white font-bold rounded-full',
        CURRENCY_COLORS[currency],
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      )}
    >
      {currency}
    </span>
  )
}

// Status Badge
interface StatusBadgeProps {
  status: TransactionStatus
}

const STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; Icon: typeof Check }> = {
  pending: { label: 'Bekliyor', color: 'bg-amber-100 text-amber-700', Icon: Clock },
  received: { label: 'Alındı', color: 'bg-emerald-100 text-emerald-700', Icon: Check },
  paid: { label: 'Ödendi', color: 'bg-blue-100 text-blue-700', Icon: Check },
  cancelled: { label: 'İptal', color: 'bg-red-100 text-red-700', Icon: Ban },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const { Icon } = config
  
  return (
    <span 
      className={cn(
        'text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1',
        config.color
      )}
    >
      <Icon size={12} />
      {config.label}
    </span>
  )
}
