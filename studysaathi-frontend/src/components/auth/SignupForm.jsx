import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { FACULTIES, SEMESTERS } from '../../utils/constants';

const SignupForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    faculty: '',
    semester: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.faculty) {
      newErrors.faculty = 'Faculty is required';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const { confirm_password, ...signupData } = formData;
      await signup(signupData);
      showSuccess('Account created! Please verify your email.');
      onSuccess(formData.email);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="full_name"
        type="text"
        icon={User}
        placeholder="Enter your full name"
        value={formData.full_name}
        onChange={handleChange}
        error={errors.full_name}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        icon={Mail}
        placeholder="your.email@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Select
        label="Faculty"
        name="faculty"
        options={FACULTIES}
        value={formData.faculty}
        onChange={handleChange}
        error={errors.faculty}
      />

      <Select
        label="Current Semester"
        name="semester"
        options={SEMESTERS}
        value={formData.semester}
        onChange={handleChange}
        error={errors.semester}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        name="confirm_password"
        type="password"
        icon={Lock}
        placeholder="Confirm your password"
        value={formData.confirm_password}
        onChange={handleChange}
        error={errors.confirm_password}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  );
};

export default SignupForm;