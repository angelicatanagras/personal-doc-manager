import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const formatStorage = (bytes) => {
  if (!bytes || bytes === 0) return '0 KB';
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
    <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-[28px] font-bold ${color ?? 'text-[#1E293B]'}`}>{value}</p>
    {sub && <p className="text-[12px] text-[#94A3B8] mt-0.5">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/api/admin/stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {navOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setNavOpen(false)} />}
      {/* Admin sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-[210px] bg-[#1E293B] flex flex-col flex-shrink-0 transform transition-transform duration-200 md:relative md:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="white"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8.414L12.586 3H5z" /></svg>
            </div>
            <span className="text-white font-bold text-[14px]">CloudDoc</span>
            <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wide">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 text-[13px]">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 text-white font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            Users
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[12px] font-medium truncate">{user?.name}</p>
              <p className="text-[#64748B] text-[10px] truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-[12px] text-[#94A3B8] hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-4 md:px-5 flex-shrink-0 gap-3">
          <button onClick={() => setNavOpen(true)} className="md:hidden p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <span className="text-[15px] font-bold text-[#1E293B]">Admin Dashboard</span>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          {loading ? (
            <p className="text-sm text-[#64748B] py-10 text-center">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
                <StatCard label="Active Users" value={stats?.activeUsers ?? 0} color="text-emerald-600" />
                <StatCard label="Suspended" value={stats?.suspendedUsers ?? 0} color="text-red-500" />
                <StatCard label="Total Documents" value={stats?.totalDocuments ?? 0} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-wide mb-1">Total Storage Used</p>
                  <p className="text-[28px] font-bold text-[#1E293B]">
                    {formatStorage(stats?.totalStorage ?? 0)}
                  </p>
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between">
                  <p className="text-[13px] font-semibold text-[#1E293B] mb-2">Quick actions</p>
                  <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0F766E] hover:underline">
                    Manage users →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
