import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const NAV = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: <GridIcon />, text: 'Dashboard' },
      { to: '/documents', icon: <DocIcon />, text: 'All Documents' },
      { to: '/folders', icon: <FolderIcon />, text: 'Folders' },
      { to: '/tags', icon: <TagIcon />, text: 'Tags' },
    ],
  },
  {
    label: 'Alerts',
    items: [{ to: '/expiring', icon: <AlertIcon />, text: 'Expiring Soon', badge: true }],
  },
  {
    label: 'System',
    items: [{ to: '/trash', icon: <TrashIcon />, text: 'Trash' }],
  },
];

export default function Sidebar({ isOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    axiosInstance.get('/api/documents')
      .then(({ data }) => {
        const count = data.filter((d) => d.status === 'expiring' || d.status === 'expired').length;
        setAlertCount(count);
      })
      .catch(() => {});
  }, []);

  const storageUsed = user?.storageUsed ?? 0;
  const storageQuota = user?.storageQuota ?? 5368709120;
  const usedGB = (storageUsed / 1073741824).toFixed(1);
  const totalGB = (storageQuota / 1073741824).toFixed(0);
  const pct = Math.min(100, Math.round((storageUsed / storageQuota) * 100));

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-30
        w-[210px] min-w-[210px] bg-[#1E293B] flex flex-col h-screen
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#14B8A6] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span className="text-[16px] font-bold text-[#F1F5F9] tracking-tight">CloudDoc</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-[#64748B] hover:text-[#94A3B8] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest px-2 pt-2 pb-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#14B8A6]/20 text-[#5EEAD4]'
                      : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.text}</span>
                {item.badge && alertCount > 0 && (
                  <span className="ml-auto bg-[#D97706] text-white text-[10px] font-bold rounded-full px-1.5 py-px min-w-[18px] text-center">
                    {alertCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Storage meter */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-[#CBD5E1]">Storage</span>
          <span className="text-[11px] text-[#94A3B8]">{usedGB} / {totalGB} GB</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#14B8A6] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-[#94A3B8]">{pct}% used</p>
      </div>

      {/* User — clickable, links to /profile */}
      <div className="border-t border-white/[0.06]">
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-4 py-3.5 hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#F1F5F9] truncate group-hover:text-white">{user?.name ?? 'User'}</p>
            <p className="text-[11px] text-[#94A3B8]">{user?.role === 'admin' ? 'Admin' : 'Personal account'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-[#64748B] hover:text-[#94A3B8] transition-colors flex-shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </Link>
      </div>
      </aside>
    </>
  );
}

function GridIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function DocIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
function FolderIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}
function TagIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}
function AlertIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
}
