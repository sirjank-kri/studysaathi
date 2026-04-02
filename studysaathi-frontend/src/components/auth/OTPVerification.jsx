import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const OTPVerification = ({ email }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.verifyOTP(email, otpString);
      setUser(data.user);
      showSuccess('Email verified successfully!');
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authService.resendOTP(email);
      showSuccess('OTP sent successfully!');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      showError('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Verify Your Email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Verify Email
        </Button>
      </form>

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-gray-600">
            Resend code in <span className="font-semibold text-primary-600">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;