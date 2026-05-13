import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, login } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoError, setInfoError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/api/auth/profile');
        setFormData({ name: data.name, email: data.email });
      } catch {
        setInfoError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setInfoSuccess('');
    setInfoError('');
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setPwSuccess('');
    setPwError('');
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const { data } = await axiosInstance.put('/api/auth/profile', {
        name: formData.name,
        email: formData.email,
      });
      login(data);
      setInfoSuccess('Profile updated successfully.');
    } catch (err) {
      setInfoError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    setSavingPassword(true);
    try {
      await axiosInstance.put('/api/auth/profile', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPwSuccess('Password updated successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="min-h-[52px] bg-white border-b border-[#E2E8F0] flex items-center px-4 sm:px-5 gap-3 flex-shrink-0 py-2">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-1 mr-1 p-1 text-[#64748B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-[#1E293B]">Profile</h1>
            <p className="text-[12px] text-[#64748B]">Manage your account details.</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="max-w-lg mx-auto space-y-6">

            {/* Account info */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h2 className="text-[14px] font-semibold text-[#1E293B] mb-4">Account information</h2>

              {infoError && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {infoError}
                </div>
              )}
              {infoSuccess && (
                <div className="mb-4 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  {infoSuccess}
                </div>
              )}

              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInfoChange}
                    required
                    className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInfoChange}
                    required
                    className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="w-full py-2.5 px-4 bg-[#1E293B] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {savingInfo ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </div>

            {/* Change password */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h2 className="text-[14px] font-semibold text-[#1E293B] mb-4">Change password</h2>

              {pwError && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="mb-4 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  {pwSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Current password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">New password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1E293B] mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2.5 px-4 bg-[#1E293B] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {savingPassword ? 'Updating...' : 'Update password'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
