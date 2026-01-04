import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Currency, TransactionStatus, TransactionType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

// Format currency
export function formatCurrency(amount: number, currency: Currency = 'TRY'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || ''
  return `${symbol}${amount.toLocaleString('tr-TR', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`
}

// Format TRY
export function formatTRY(amount: number): string {
  return formatCurrency(amount, 'TRY')
}

// Convert to TRY
export function toTRY(amount: number, currency: Currency, rates: Record<Currency, number>): number {
  return amount * (rates[currency] || 1)
}

// Status info
export const STATUS_INFO: Record<TransactionStatus, { label: string; color: string }> = {
  pending: { label: 'Bekliyor', color: 'bg-amber-100 text-amber-700' },
  received: { label: 'Alındı', color: 'bg-emerald-100 text-emerald-700' },
  paid: { label: 'Ödendi', color: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'İptal', color: 'bg-red-100 text-red-700' },
}

// Get status label
export function getStatusLabel(status: TransactionStatus): string {
  return STATUS_INFO[status]?.label || status
}

// Months in Turkish
export const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

// Default categories
export const DEFAULT_CATEGORIES = {
  income: [
    { id: 'medical', name: 'Tıbbi Hizmetler', icon: '🏥', color: '#10B981' },
    { id: 'dental', name: 'Diş Hizmetleri', icon: '🦷', color: '#8B5CF6' },
    { id: 'consulting', name: 'Danışmanlık', icon: '💼', color: '#3B82F6' },
    { id: 'salary', name: 'Maaş', icon: '💰', color: '#F59E0B' },
    { id: 'other_income', name: 'Diğer Gelir', icon: '➕', color: '#6B7280' },
  ],
  expense: [
    { id: 'housing', name: 'Ev Giderleri', icon: '🏠', color: '#EF4444' },
    { id: 'software', name: 'Yazılım/Dijital', icon: '💻', color: '#8B5CF6' },
    { id: 'personal', name: 'Kişisel', icon: '👤', color: '#F59E0B' },
    { id: 'transport', name: 'Ulaşım', icon: '🚗', color: '#3B82F6' },
    { id: 'personnel', name: 'Personel', icon: '👥', color: '#EC4899' },
    { id: 'other_expense', name: 'Diğer Gider', icon: '➖', color: '#6B7280' },
  ],
}

// Get category info
export function getCategoryInfo(categoryId: string, type: TransactionType) {
  const categories = DEFAULT_CATEGORIES[type] || []
  return categories.find(c => c.id === categoryId) || { 
    id: categoryId, 
    name: 'Diğer', 
    icon: '📌', 
    color: '#6B7280' 
  }
}

// Format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Get today's date in YYYY-MM-DD format
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

// Generate UUID (for client-side before Supabase)
export function generateId(): string {
  return crypto.randomUUID()
}
