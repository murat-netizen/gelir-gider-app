'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { MONTHS } from '@/lib/utils'
import {
  Sidebar,
  MobileNav,
  Modal,
  TransactionForm,
  Dashboard,
  TransactionsPage,
  RecurringPage,
  ReportsPage,
  SettingsPage,
} from '@/components'
import { Transaction } from '@/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    isModalOpen,
    setModalOpen,
    editingTransaction,
    setEditingTransaction,
  } = useAppStore()
  
  const openNewTransaction = () => {
    setEditingTransaction(null)
    setModalOpen(true)
  }
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTransaction(null)
  }
  
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard'
      case 'transactions': return 'İşlemler'
      case 'recurring': return 'Düzenli Ödemeler'
      case 'reports': return 'Raporlar'
      case 'settings': return 'Ayarlar'
      default: return 'Dashboard'
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50">
      {/* Sidebar - Desktop */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Mobile Logo */}
              <h1 className="text-xl font-bold text-indigo-600 lg:hidden">💼 GelirGider</h1>
              
              {/* Page Title */}
              <h2 className="text-xl font-bold text-slate-800 hidden lg:block">
                {getPageTitle()}
              </h2>
              
              {/* Month/Year Selector */}
              {(activeTab === 'dashboard' || activeTab === 'transactions') && (
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="bg-transparent px-2 lg:px-3 py-2 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {MONTHS.map((month, idx) => (
                      <option key={idx} value={idx}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="bg-transparent px-2 lg:px-3 py-2 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {[2024, 2025, 2026, 2027].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {/* Add Button */}
            <button
              onClick={openNewTransaction}
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              <Plus size={20} />
              Yeni İşlem
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              onViewAllTransactions={() => setActiveTab('transactions')}
              onEditTransaction={handleEditTransaction}
            />
          )}
          
          {activeTab === 'transactions' && (
            <TransactionsPage onEditTransaction={handleEditTransaction} />
          )}
          
          {activeTab === 'recurring' && <RecurringPage />}
          
          {activeTab === 'reports' && <ReportsPage />}
          
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={openNewTransaction}
      />
      
      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'İşlemi Düzenle' : 'Yeni İşlem'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
