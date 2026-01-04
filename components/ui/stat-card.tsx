'use client'

import { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: number
  gradient: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, gradient }: StatCardProps) {
  return (
    <div 
      className={cn(
        'rounded-2xl p-5 text-white relative overflow-hidden group',
        'hover:scale-[1.02] transition-transform duration-300',
        gradient
      )}
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/80 text-sm font-medium">{title}</span>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Icon size={20} />
          </div>
        </div>
        
        {/* Value */}
        <div className="text-2xl font-bold mb-1">{value}</div>
        
        {/* Subtitle */}
        {subtitle && (
          <div className="text-white/70 text-sm">{subtitle}</div>
        )}
        
        {/* Trend */}
        {trend !== undefined && trend !== 0 && (
          <div 
            className={cn(
              'flex items-center gap-1 mt-2 text-sm',
              trend > 0 ? 'text-emerald-300' : 'text-red-300'
            )}
          >
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>%{Math.abs(trend).toFixed(1)} geçen aya göre</span>
          </div>
        )}
      </div>
    </div>
  )
}
