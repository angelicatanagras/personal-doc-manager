import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const LOGIN_IMG =
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=900&q=80';

const InputField = ({ label, id, name, type, placeholder, autoComplete, value, onChange, required, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
    />
  </div>
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
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-slate-900 overflow-hidden">
        <img
          src={LOGIN_IMG}
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">CloudDoc</span>
          </Link>
        </div>
        <div className="relative">
          <blockquote className="text-white/90 text-2xl font-display font-bold leading-snug mb-4">
            "All your important documents, organised and always within reach."
          </blockquote>
          <p className="text-slate-400 text-sm">Passports · Contracts · Insurance · Medical · Legal</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">CloudDoc</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-700 font-medium hover:text-teal-600 transition-colors">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            >
              <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Forgot password?
              </a>
            </InputField>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-xs text-slate-400 text-center">
            By signing in, you agree to our{' '}
            <a href="#" className="underline underline-offset-2 hover:text-slate-600">terms of use</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
