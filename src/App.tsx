import React, { useState } from 'react';
import { LayoutDashboard, Database, ClipboardList, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { MeasurementVault } from './components/measurement-vault';
import { OrderTracker } from './components/order-tracker';
import { Dashboard } from './components/dashboard';

const VIEWS = {
  DASHBOARD: 'dashboard',
  VAULT: 'vault',
  TRACKER: 'tracker'
};

function App() {
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);

  const navItems = [
    { id: VIEWS.DASHBOARD, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: VIEWS.VAULT, label: 'Measurement Vault', icon: Database },
    { id: VIEWS.TRACKER, label: 'Order Tracker', icon: ClipboardList },
  ];

  const renderView = () => {
    switch (activeView) {
      case VIEWS.DASHBOARD:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Dashboard />
          </motion.div>
        );
      case VIEWS.VAULT:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <MeasurementVault />
          </motion.div>
        );
      case VIEWS.TRACKER:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <OrderTracker />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0D1B2A] text-white flex-col p-6 fixed inset-y-0 left-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#A3704C] rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-[#E6B800]">SG</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">SartorGrid</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                activeView === item.id ? "bg-[#A3704C] text-white" : "text-slate-300 hover:bg-[#A3704C]/50 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pb-24 md:pb-6">
        {renderView()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D1B2A] border-t border-[#1e2d47] flex justify-around items-center h-16 px-4 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeView === item.id ? "text-white" : "text-slate-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;