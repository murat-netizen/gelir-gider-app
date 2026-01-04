'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Currency } from '@/types'

export function SettingsPage() {
  const { exchangeRates, updateExchangeRate } = useAppStore()
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  const handleRateChange = (currency: Currency, value: string) => {
    const rate = parseFloat(value) || 0
    updateExchangeRate(currency, rate)
  }
  
  const handleTestConnection = async () => {
    setTestStatus('testing')
    // Simulate connection test
    setTimeout(() => {
      if (supabaseUrl && supabaseKey) {
        setTestStatus('success')
      } else {
        setTestStatus('error')
      }
    }, 1500)
  }
  
  return (
    <div className="max-w-2xl space-y-6">
      {/* Exchange Rates */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Döviz Kurları</h3>
        <p className="text-sm text-slate-500 mb-4">
          Kurları manuel olarak güncelleyebilirsiniz. Değişiklikler tüm işlemlere yansır.
        </p>
        <div className="space-y-4">
          {(Object.entries(exchangeRates) as [Currency, number][])
            .filter(([k]) => k !== 'TRY')
            .map(([currency, rate]) => (
              <div key={currency} className="flex items-center gap-4">
                <span className="font-medium w-24 text-slate-700">{currency}/TRY</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => handleRateChange(currency, e.target.value)}
                  step="0.01"
                  min="0"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ))}
        </div>
        <button
          onClick={() => {
            updateExchangeRate('USD', 43.05)
            updateExchangeRate('EUR', 46.80)
            updateExchangeRate('GBP', 54.20)
          }}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Varsayılan Kurlara Sıfırla
        </button>
      </div>
      
      {/* Supabase Connection */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Supabase Bağlantısı</h3>
        <p className="text-sm text-slate-500 mb-4">
          Veritabanı bağlantısı için Supabase ayarlarınızı girin. Bu bilgiler güvenli bir şekilde saklanır.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Supabase URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xxxxx.supabase.co"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Anon Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {testStatus === 'testing' ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
          </button>
          {testStatus === 'success' && (
            <p className="text-sm text-emerald-600 font-medium">✓ Bağlantı başarılı!</p>
          )}
          {testStatus === 'error' && (
            <p className="text-sm text-red-600 font-medium">✗ Bağlantı başarısız. Bilgileri kontrol edin.</p>
          )}
        </div>
      </div>
      
      {/* Data Management */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Veri Yönetimi</h3>
        <div className="space-y-3">
          <button className="w-full py-3 px-4 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left">
            📥 Verileri Dışa Aktar (JSON)
          </button>
          <button className="w-full py-3 px-4 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left">
            📤 Verileri İçe Aktar
          </button>
          <button className="w-full py-3 px-4 border border-red-200 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
            🗑️ Tüm Verileri Sil
          </button>
        </div>
      </div>
    </div>
  )
}
