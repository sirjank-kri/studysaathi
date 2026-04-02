import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FACULTIES, SEMESTERS } from '../utils/constants';
import api from '../services/api';
import toast from 'react-hot-toast';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.91c1.69 0 3.22.59 4.42 1.58l3.29-3.29A11.95 11.95 0 0 0 12 0C7.27 0 3.2 2.7 1.24 6.65l4.03 3.11Z"/>
    <path fill="#34A853" d="M16.04 18.01A7.06 7.06 0 0 1 12 19.09 7.08 7.08 0 0 1 5.28 14.27L1.24 17.33A11.95 11.95 0 0 0 12 24c2.93 0 5.73-.96 7.83-2.99l-3.79-2.99Z"/>
    <path fill="#4A90E2" d="M19.83 21.01A11.94 11.94 0 0 0 23.45 12c0-.71-.08-1.47-.18-2.18H12v4.64h6.44a5.9 5.9 0 0 1-2.4 3.56l3.79 2.99Z"/>
    <path fill="#FBBC05" d="M5.28 14.27a7.12 7.12 0 0 1 0-4.51L1.24 6.65A11.94 11.94 0 0 0 0 12c0 1.92.44 3.73 1.24 5.33l4.04-3.06Z"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup, verifyOTP, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // ✅ ADDED THIS
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

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!formData.faculty) newErrors.faculty = 'Select faculty';
    if (!formData.semester) newErrors.semester = 'Select semester';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      console.log('📤 Sending signup data:', formData);
      
      const response = await signup(formData);
      
      console.log('✅ Signup response:', response);
      
      // Show OTP in alert for testing
      if (response.otp) {
        alert(`Your OTP is: ${response.otp}\n\nThis is shown for testing only!`);
      }
      
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    console.log('🔐 Verifying OTP:', { email: formData.email, otp: otpString });
    
    if (otpString.length !== 6) {
      toast.error('Enter complete OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await verifyOTP(formData.email, otpString);
      console.log('✅ OTP verified:', response);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Invalid OTP. Please try again.';
      
      toast.error(errorMessage);
      
      // If OTP expired or used, show resend hint
      if (errorMessage.includes('expired') || errorMessage.includes('used')) {
        toast.info('Click "Resend" to get a new OTP', { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await api.post('/auth/resend-otp/', { email: formData.email });
      console.log('📧 New OTP:', response.data);
      
      // Show OTP in alert for testing
      if (response.data.otp) {
        alert(`New OTP: ${response.data.otp}\n\nThis is shown for testing only!`);
      }
      
      toast.success('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (error) {
      console.error('❌ Resend failed:', error);
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold gradient-text">StudySaathi</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? 'Create your account' : 'Verify your email'}
          </h1>
          <p className="text-dark-400">
            {step === 1 ? 'Join the TU student community' : `Code sent to ${formData.email}`}
          </p>
        </div>

        <div className="auth-card">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`input-dark pl-11 ${errors.full_name ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors.full_name && <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input-dark pl-11 ${errors.email ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              {/* Faculty & Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Faculty</label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className={`select-dark ${errors.faculty ? 'border-red-500/50' : ''}`}
                  >
                    <option value="">Select...</option>
                    {FACULTIES.map(f => (
                      <option key={f.value} value={f.value}>{f.value}</option>
                    ))}
                  </select>
                  {errors.faculty && <p className="mt-1 text-sm text-red-400">{errors.faculty}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={`select-dark ${errors.semester ? 'border-red-500/50' : ''}`}
                  >
                    <option value="">Select...</option>
                    {SEMESTERS.map(s => (
                      <option key={s.value} value={s.value}>Sem {s.value}</option>
                    ))}
                  </select>
                  {errors.semester && <p className="mt-1 text-sm text-red-400">{errors.semester}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className={`input-dark pl-11 pr-11 ${errors.password ? 'border-red-500/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-6">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>

              <p className="text-xs text-dark-400 text-center mt-4">
                By signing up, you agree to our <Link to="/terms" className="text-primary-400">Terms</Link> and <Link to="/privacy" className="text-primary-400">Privacy Policy</Link>
              </p>
            </form>
          ) : (
            /* OTP STEP */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-center gap-3">
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
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary-500"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-center space-y-2">
                <p className="text-dark-400 text-sm">
                  Didn't receive code?{' '}
                  <button 
                    type="button" 
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="text-primary-400 font-medium hover:text-primary-300"
                  >
                    {resendLoading ? 'Sending...' : 'Resend'}
                  </button>
                </p>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-dark-400 hover:text-white text-sm"
                >
                  ← Back to signup
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-dark-400 text-sm">or</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <button className="btn-secondary w-full flex items-center justify-center gap-3">
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="text-center text-dark-400 mt-6">
                Already have an account? <Link to="/login" className="text-primary-400 font-medium">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;