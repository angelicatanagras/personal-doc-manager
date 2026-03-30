import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';
import ConfirmDialog from '../../components/ConfirmDialog';

const formatStorage = (bytes) => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};

export default function UserManagement() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/admin/users')
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (u) => {
    const endpoint = u.status === 'active' ? 'suspend' : 'activate';
    try {
      const { data } = await axiosInstance.put(`/api/admin/users/${u._id}/${endpoint}`);
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, status: data.user.status } : x));
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/admin/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setDeleteTarget(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Admin sidebar */}
      <aside className="w-[210px] bg-[#1E293B] flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="white"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8.414L12.586 3H5z"/></svg>
            </div>
            <span className="text-white font-bold text-[14px]">CloudDoc</span>
            <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wide">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 text-[13px]">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 text-white font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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
        <header className="h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-5 flex-shrink-0">
          <span className="text-[15px] font-bold text-[#1E293B]">User Management</span>
          <span className="ml-2 text-[13px] text-[#64748B]">— {users.length} user{users.length !== 1 ? 's' : ''}</span>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

          {loading ? (
            <p className="text-sm text-[#64748B] py-10 text-center">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-[#64748B] py-10 text-center">No users registered yet.</p>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B]">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Docs</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Storage</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Joined</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} className={`border-b border-[#F1F5F9] ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-[#0F766E] text-[11px] font-bold flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1E293B]">{u.name}</p>
                            <p className="text-[11px] text-[#94A3B8]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {u.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#1E293B]">{u.documentCount}</td>
                      <td className="px-4 py-3 text-[#1E293B]">{formatStorage(u.storageUsed)}</td>
                      <td className="px-4 py-3 text-[#64748B]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                              u.status === 'active'
                                ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="px-2.5 py-1 rounded text-[11px] font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete user?"
          message={`"${deleteTarget.name}" and all their documents will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete user"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
