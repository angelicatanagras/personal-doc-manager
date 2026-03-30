import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const DocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3C4.44772 3 4 3.44772 4 4V16C4 16.5523 4.44772 17 5 17H15C15.5523 17 16 16.5523 16 16V7.41421C16 7.14899 15.8946 6.89464 15.7071 6.70711L12.2929 3.29289C12.1054 3.10536 11.8511 3 11.5858 3H5Z" fill="white" fillOpacity="0.9"/>
    <path d="M12 3.5V7H15.5" stroke="white" strokeOpacity="0.5" strokeWidth="1" fill="none"/>
    <line x1="7" y1="10" x2="13" y2="10" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="11" y2="13" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/auth/login', formData);
      if (data.role !== 'admin') {
        return setError('Access denied. This portal is for administrators only.');
      }
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] text-center">

        {/* Logo — red for admin */}
        <div className="inline-flex items-center justify-center w-10 h-10 bg-[#EF4444] rounded-[10px] mb-5">
          <DocIcon />
        </div>

        <h1 className="text-[22px] font-bold text-[#1E293B] mb-2 tracking-tight">
          CloudDoc{' '}
          <span className="inline-flex items-center px-1.5 py-0.5 bg-red-50 text-red-500 border border-red-200 rounded text-[10px] font-bold tracking-wider uppercase align-middle relative -top-0.5">
            Admin
          </span>
        </h1>
        <p className="text-sm text-[#64748B] mb-8">
          Restricted access —{' '}
          <Link to="/login" className="text-[#1E293B] font-medium underline underline-offset-2 hover:text-[#0F766E]">
            ← Back to user login
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-[13px] font-medium text-[#1E293B] mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white placeholder-[#94A3B8] focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-[13px] font-medium text-[#1E293B] mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white placeholder-[#94A3B8] focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 px-4 bg-[#1E293B] text-white text-sm font-semibold rounded-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in to Admin Portal'}
          </button>
        </form>

        <p className="mt-6 text-xs text-[#64748B] leading-relaxed">
          Restricted to authorised administrators only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
