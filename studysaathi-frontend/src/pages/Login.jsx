import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-7">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold gradient-text">StudySaathi</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-dark-400 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500"
                  size={17}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-dark pl-10 ${
                    errors.email ? 'border-red-500/50 focus:border-red-500/70' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-dark-200">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500"
                  size={17}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-dark pl-10 pr-11 ${
                    errors.password ? 'border-red-500/50 focus:border-red-500/70' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-dark-500 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-dark-400 text-sm">
            New to StudySaathi?{' '}
            <Link
              to="/signup"
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-dark-600 text-xs mt-6">
          Built for TU students · Free forever
        </p>
      </div>
    </div>
  );
};

export default Login;