import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FACULTIES, SEMESTERS } from '../utils/constants';
import api from '../services/api';
import toast from 'react-hot-toast';

// Step indicator component
const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2].map((step) => (
      <div key={step} className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            step < current
              ? 'bg-green-500 text-white'
              : step === current
              ? 'bg-primary-500 text-white'
              : 'bg-white/8 text-dark-500'
          }`}
        >
          {step < current ? <CheckCircle size={14} /> : step}
        </div>
        {step < 2 && (
          <div
            className={`w-12 h-px transition-colors ${
              step < current ? 'bg-green-500/50' : 'bg-white/10'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup, verifyOTP } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    faculty: '',
    semester: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Paste handler for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'At least 6 characters';
    if (!formData.faculty) newErrors.faculty = 'Select your faculty';
    if (!formData.semester) newErrors.semester = 'Select your semester';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(formData);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    try {
      await verifyOTP(formData.email, otpString);
      toast.success('Account created! Welcome to StudySaathi 🎉');
      navigate('/dashboard');
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Invalid code. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await api.post('/auth/resend-otp/', { email: formData.email });
      if (response.data.otp) {
        alert(`OTP (dev mode): ${response.data.otp}`);
      }
      toast.success('New code sent!');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (error) {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-7">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold gradient-text">StudySaathi</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">
            {step === 1 ? 'Create your account' : 'Check your email'}
          </h1>
          <p className="text-dark-400 text-sm">
            {step === 1
              ? 'Join thousands of TU students'
              : `We sent a 6-digit code to ${formData.email}`}
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Card */}
        <div className="auth-card">

          {/* ── Step 1: Signup Form ── */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500"
                    size={17}
                  />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`input-dark pl-10 ${
                      errors.full_name ? 'border-red-500/50' : ''
                    }`}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-xs text-red-400">{errors.full_name}</p>
                )}
              </div>

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
                      errors.email ? 'border-red-500/50' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Faculty + Semester side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Faculty
                  </label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className={`select-dark ${errors.faculty ? 'border-red-500/50' : ''}`}
                  >
                    <option value="">Select...</option>
                    {FACULTIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.value}
                      </option>
                    ))}
                  </select>
                  {errors.faculty && (
                    <p className="mt-1 text-xs text-red-400">{errors.faculty}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={`select-dark ${errors.semester ? 'border-red-500/50' : ''}`}
                  >
                    <option value="">Select...</option>
                    {SEMESTERS.map((s) => (
                      <option key={s.value} value={s.value}>
                        Sem {s.value}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="mt-1 text-xs text-red-400">{errors.semester}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Password
                </label>
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
                    placeholder="Minimum 6 characters"
                    className={`input-dark pl-10 pr-11 ${
                      errors.password ? 'border-red-500/50' : ''
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
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
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
                    Create Account <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="text-xs text-dark-500 text-center mt-3">
                By signing up you agree to our{' '}
                <Link to="/terms" className="text-primary-400 hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-400 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* Info box */}
              <div className="p-4 rounded-xl bg-primary-500/8 border border-primary-500/20 text-center">
                <p className="text-dark-300 text-sm">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-white font-semibold text-sm mt-0.5">
                  {formData.email}
                </p>
              </div>

              {/* OTP boxes */}
              <div className="flex justify-center gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`w-11 h-13 text-center text-lg font-bold rounded-xl border transition-all outline-none
                      ${
                        digit
                          ? 'bg-primary-500/15 border-primary-500/60 text-white'
                          : 'bg-white/5 border-white/10 text-white'
                      }
                      focus:border-primary-500 focus:bg-primary-500/10`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={17} /> Verify & Continue
                  </>
                )}
              </button>

              {/* Resend + back */}
              <div className="text-center space-y-3">
                <p className="text-dark-400 text-sm">
                  Didn't get the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="text-primary-400 font-semibold hover:text-primary-300 transition-colors disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend code'}
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-dark-500 hover:text-dark-300 text-sm transition-colors"
                >
                  ← Back to signup
                </button>
              </div>
            </form>
          )}

          {/* Sign in link (step 1 only) */}
          {step === 1 && (
            <p className="text-center text-dark-400 text-sm mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-dark-600 text-xs mt-6">
          Built for TU students · Free forever
        </p>
      </div>
    </div>
  );
};

export default Signup;