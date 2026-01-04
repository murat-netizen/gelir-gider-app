'use client'

import { useAppStore } from '@/lib/store'
import { formatTRY, cn } from '@/lib/utils'

export function ReportsPage() {
  const { getYearlyData, selectedYear, selectedMonth } = useAppStore()
  
  const yearlyData = getYearlyData()
  const totalIncome = yearlyData.reduce((s, d) => s + d.income, 0)
  const totalExpense = yearlyData.reduce((s, d) => s + d.expense, 0)
  const totalNet = yearlyData.reduce((s, d) => s + d.net, 0)
  const totalMargin = totalIncome > 0 ? (totalNet / totalIncome * 100) : 0
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{selectedYear} Yıllık Özet</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Ay</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Gelir</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Gider</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Net</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Kar Marjı</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((data, idx) => {
                const margin = data.income > 0 ? (data.net / data.income * 100) : 0
                return (
                  <tr 
                    key={idx} 
                    className={cn(
                      'border-b border-slate-100',
                      idx === selectedMonth ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    )}
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">{data.month}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                      {formatTRY(data.income)}
                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-medium">
                      {formatTRY(data.expense)}
                    </td>
                    <td className={cn(
                      'px-6 py-4 text-right font-bold',
                      data.net >= 0 ? 'text-blue-600' : 'text-orange-600'
                    )}>
                      {formatTRY(data.net)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      {data.income > 0 ? `%${margin.toFixed(1)}` : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-slate-100">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-800">TOPLAM</td>
                <td className="px-6 py-4 text-right text-emerald-600 font-bold">
                  {formatTRY(totalIncome)}
                </td>
                <td className="px-6 py-4 text-right text-red-600 font-bold">
                  {formatTRY(totalExpense)}
                </td>
                <td className={cn(
                  'px-6 py-4 text-right font-bold',
                  totalNet >= 0 ? 'text-blue-600' : 'text-orange-600'
                )}>
                  {formatTRY(totalNet)}
                </td>
                <td className="px-6 py-4 text-right text-slate-600 font-bold">
                  %{totalMargin.toFixed(1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
