import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3C4.44772 3 4 3.44772 4 4V16C4 16.5523 4.44772 17 5 17H15C15.5523 17 16 16.5523 16 16V7.41421C16 7.14899 15.8946 6.89464 15.7071 6.70711L12.2929 3.29289C12.1054 3.10536 11.8511 3 11.5858 3H5Z" fill="white" fillOpacity="0.9"/>
    <path d="M12 3.5V7H15.5" stroke="white" strokeOpacity="0.5" strokeWidth="1" fill="none"/>
    <line x1="7" y1="10" x2="13" y2="10" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="11" y2="13" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const Login = () => {
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
      login(data);
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] text-center">

        {/* Logo */}
        <div className="inline-flex items-center justify-center w-10 h-10 bg-[#0F766E] rounded-[10px] mb-5">
          <DocIcon />
        </div>

        <h1 className="text-[22px] font-bold text-[#1E293B] mb-2 tracking-tight">
          Welcome to CloudDoc
        </h1>
        <p className="text-sm text-[#64748B] mb-8">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[#1E293B] font-medium underline underline-offset-2 hover:text-[#0F766E]">
            Sign up
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
              placeholder="m@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white placeholder-[#94A3B8] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-[#1E293B]">
                Password
              </label>
              <a href="#" className="text-xs text-[#64748B] underline underline-offset-2 hover:text-[#1E293B]">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full py-2 px-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white placeholder-[#94A3B8] focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 px-4 bg-[#1E293B] text-white text-sm font-semibold rounded-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-xs text-[#64748B] leading-relaxed">
          By clicking continue, you agree to our terms of use.
        </p>
      </div>
    </div>
  );
};

export default Login;
