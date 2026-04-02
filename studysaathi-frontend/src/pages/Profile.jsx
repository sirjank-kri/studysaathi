import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, BookOpen, Edit2, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FACULTIES, SEMESTERS } from '../utils/constants';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    faculty: '',
    semester: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        faculty: user.faculty || '',
        semester: user.semester || '',
        bio: user.bio || '',
      });
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name || '',
      faculty: user.faculty || '',
      semester: user.semester || '',
      bio: user.bio || '',
    });
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-dark-400">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-4xl font-bold text-white">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-dark-300 hover:text-white hover:bg-white/20 transition-all">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
            <p className="text-dark-400">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="badge badge-purple">{user.faculty}</span>
              <span className="badge badge-cyan">Semester {user.semester}</span>
            </div>
          </div>

          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-300 mb-2">Full Name</label>
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-2">Email</label>
                <input
                  value={user.email}
                  className="input-dark opacity-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-2">Faculty</label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="select-dark"
                >
                  {FACULTIES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-2">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="select-dark"
                >
                  {SEMESTERS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={3}
                className="input-dark resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
                <X size={16} /> Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-dark-300">{user.bio || 'No bio added yet.'}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-2xl font-bold text-white">{stats.questions_count}</p>
            <p className="text-dark-400 text-sm">Questions</p>
          </div>
          <div className="stat-card">
            <p className="text-2xl font-bold text-white">{stats.answers_count}</p>
            <p className="text-dark-400 text-sm">Answers</p>
          </div>
          <div className="stat-card">
            <p className="text-2xl font-bold text-white">{stats.total_upvotes}</p>
            <p className="text-dark-400 text-sm">Upvotes</p>
          </div>
          <div className="stat-card">
            <p className="text-2xl font-bold text-white">{stats.reputation}</p>
            <p className="text-dark-400 text-sm">Reputation</p>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-dark-300 hover:text-white transition-all">
            <BookOpen size={18} /> My Dashboard
          </Link>
          <Link to="/questions" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-dark-300 hover:text-white transition-all">
            <User size={18} /> Browse Questions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;