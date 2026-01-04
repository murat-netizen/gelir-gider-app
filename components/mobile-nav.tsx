'use client'

import { Home, List, Plus, PieChart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAddClick: () => void
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Ana Sayfa' },
  { id: 'transactions', icon: List, label: 'İşlemler' },
  { id: 'add', icon: Plus, label: 'Ekle', special: true },
  { id: 'reports', icon: PieChart, label: 'Raporlar' },
  { id: 'settings', icon: Settings, label: 'Ayarlar' },
]

export function MobileNav({ activeTab, onTabChange, onAddClick }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id === 'add' ? onAddClick() : onTabChange(item.id)}
            className={cn(
              'flex flex-col items-center py-2 px-3 rounded-xl transition-all',
              item.special
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white -mt-6 shadow-lg shadow-indigo-500/30'
                : activeTab === item.id
                  ? 'text-indigo-600'
                  : 'text-slate-400'
            )}
          >
            <item.icon size={item.special ? 24 : 20} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
