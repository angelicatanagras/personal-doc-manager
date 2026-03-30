import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/api/auth/profile');
        setFormData({ name: data.name, email: data.email });
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axiosInstance.put('/api/auth/profile', formData);
      login(data); // refresh context + token
      setSuccess(true);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <h1 className="text-[22px] font-bold text-[#1E293B] mb-1 tracking-tight">Your Profile</h1>
        <p className="text-sm text-[#64748B] mb-8">Update your account details.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Profile updated successfully.
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-[13px] font-medium text-[#1E293B] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white placeholder-[#94A3B8] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-[13px] font-medium text-[#1E293B] mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white placeholder-[#94A3B8] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 px-4 bg-[#1E293B] text-white text-sm font-semibold rounded-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
