'use client'

import { TrendingUp, TrendingDown, DollarSign, Clock, Calendar } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { formatTRY, MONTHS } from '@/lib/utils'
import { StatCard } from './ui/stat-card'
import { TransactionItem } from './transaction-item'
import { Transaction } from '@/types'

interface DashboardProps {
  onViewAllTransactions: () => void
  onEditTransaction: (transaction: Transaction) => void
}

export function Dashboard({ onViewAllTransactions, onEditTransaction }: DashboardProps) {
  const {
    getFilteredTransactions,
    getMonthlyTotals,
    getYearlyData,
    selectedMonth,
    deleteTransaction,
  } = useAppStore()
  
  const transactions = getFilteredTransactions()
  const { income, expense, net } = getMonthlyTotals()
  const yearlyData = getYearlyData()
  
  const pendingAmount = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount_try, 0)
  const pendingCount = transactions.filter((t) => t.status === 'pending').length
  
  const profitMargin = income > 0 ? (net / income * 100) : 0
  
  const maxChartValue = Math.max(...yearlyData.map((d) => Math.max(d.income, d.expense))) || 1
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Gelir"
          value={formatTRY(income)}
          subtitle={`${transactions.filter((t) => t.type === 'income').length} işlem`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Toplam Gider"
          value={formatTRY(expense)}
          subtitle={`${transactions.filter((t) => t.type === 'expense').length} işlem`}
          icon={TrendingDown}
          gradient="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <StatCard
          title="Net Kar/Zarar"
          value={formatTRY(net)}
          subtitle={`Kar marjı: %${profitMargin.toFixed(1)}`}
          icon={DollarSign}
          gradient={net >= 0 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
            : 'bg-gradient-to-br from-orange-500 to-amber-600'
          }
        />
        <StatCard
          title="Bekleyen"
          value={formatTRY(pendingAmount)}
          subtitle={`${pendingCount} işlem bekliyor`}
          icon={Clock}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>
      
      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-6">Yıllık Gelir-Gider Grafiği</h3>
        <div className="h-64 flex items-end gap-2">
          {yearlyData.map((data, idx) => {
            const incomeHeight = (data.income / maxChartValue) * 100
            const expenseHeight = (data.expense / maxChartValue) * 100
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 h-48 items-end">
                  <div
                    className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500 cursor-pointer"
                    style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                    title={`${data.month} Gelir: ${formatTRY(data.income)}`}
                  />
                  <div
                    className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all hover:from-red-600 hover:to-red-500 cursor-pointer"
                    style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                    title={`${data.month} Gider: ${formatTRY(data.expense)}`}
                  />
                </div>
                <span 
                  className={`text-xs font-medium ${
                    idx === selectedMonth ? 'text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  {data.month.slice(0, 3)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-600">Gelir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-slate-600">Gider</span>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-800">Son İşlemler</h3>
          <button
            onClick={onViewAllTransactions}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
          >
            Tümünü Gör →
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={onEditTransaction}
              onDelete={deleteTransaction}
            />
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>Bu ay için işlem bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
