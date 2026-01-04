'use client'

import { Home, List, Repeat, PieChart, Settings, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Currency } from '@/types'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'transactions', icon: List, label: 'İşlemler' },
  { id: 'recurring', icon: Repeat, label: 'Düzenli Ödemeler' },
  { id: 'reports', icon: PieChart, label: 'Raporlar' },
  { id: 'settings', icon: Settings, label: 'Ayarlar' },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { exchangeRates } = useAppStore()
  
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          💼 GelirGider
        </h1>
        <p className="text-sm text-slate-500 mt-1">Finansal Takip</p>
      </div>
      
      {/* Navigation */}
      <nav className="px-4 space-y-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      
      {/* Exchange Rates */}
      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
          <RefreshCw size={12} />
          Güncel Kurlar
        </div>
        <div className="space-y-2">
          {(Object.entries(exchangeRates) as [Currency, number][])
            .filter(([k]) => k !== 'TRY')
            .map(([currency, rate]) => (
              <div key={currency} className="flex items-center justify-between text-sm">
                <span className="font-medium">{currency}/TRY</span>
                <span className="text-slate-600">{rate.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>
    </aside>
  )
}
