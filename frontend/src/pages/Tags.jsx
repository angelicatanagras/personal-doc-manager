import { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Tags() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="min-h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-4 sm:px-5 gap-3 flex-shrink-0 py-2">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-[#1E293B]">Tags</h1>
            <p className="text-[12px] text-[#64748B]">Organise documents with reusable labels.</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="max-w-2xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#ECFEFF] text-[#0F766E] flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>

            <h2 className="text-[18px] font-bold text-[#1E293B] mb-2">Tags are not implemented yet</h2>
            <p className="text-sm text-[#64748B] leading-6">
              This screen is ready for a mobile-friendly tag manager. The next step is adding tag create, assign,
              rename, and delete flows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
