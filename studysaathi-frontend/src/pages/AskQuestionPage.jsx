import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, X } from 'lucide-react';
import { FACULTIES, SEMESTERS } from '../utils/constants';
import { useQuestions } from '../context/QuestionsContext';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const { addQuestion } = useQuestions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    faculty: user?.faculty || '',
    semester: user?.semester || '',
    subject: '',
    tags: [],
    is_anonymous: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 15) newErrors.title = 'Title must be at least 15 characters';
    if (!formData.content.trim()) newErrors.content = 'Description is required';
    else if (formData.content.length < 30) newErrors.content = 'Please provide more details';
    if (!formData.faculty) newErrors.faculty = 'Select your faculty';
    if (!formData.semester) newErrors.semester = 'Select your semester';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    // Add question to context
    const newQuestion = addQuestion(formData, user);
    
    setTimeout(() => {
      toast.success('Question posted successfully!');
      setLoading(false);
      navigate(`/questions/${newQuestion.id}`);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ask a Question</h1>
        <p className="text-dark-300">Get help from fellow TU students</p>
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border-primary-500/20 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="text-primary-400" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Tips for a great question</h3>
            <ul className="text-sm text-dark-300 space-y-1">
              <li>• Be specific and include relevant details</li>
              <li>• Mention what you've already tried</li>
              <li>• Use proper tags to reach the right people</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="card">
          <label className="block text-white font-semibold mb-2">Question Title</label>
          <p className="text-dark-400 text-sm mb-3">Be specific and imagine you're asking another person</p>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., How to implement binary search in C++?"
            className={`input-dark ${errors.title ? 'border-red-500/50' : ''}`}
          />
          {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
          <p className="mt-2 text-xs text-dark-400">{formData.title.length}/150 characters</p>
        </div>

        {/* Content */}
        <div className="card">
          <label className="block text-white font-semibold mb-2">Describe your problem</label>
          <p className="text-dark-400 text-sm mb-3">Include all information someone would need to answer</p>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            placeholder="Explain your question in detail. What have you tried so far? What specific help do you need?"
            className={`input-dark resize-none ${errors.content ? 'border-red-500/50' : ''}`}
          />
          {errors.content && <p className="mt-2 text-sm text-red-400">{errors.content}</p>}
        </div>

        {/* Category */}
        <div className="card">
          <label className="block text-white font-semibold mb-4">Categorize your question</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-2">Faculty *</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className={`select-dark ${errors.faculty ? 'border-red-500/50' : ''}`}
              >
                <option value="">Select faculty...</option>
                {FACULTIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              {errors.faculty && <p className="mt-1 text-sm text-red-400">{errors.faculty}</p>}
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-2">Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`select-dark ${errors.semester ? 'border-red-500/50' : ''}`}
              >
                <option value="">Select semester...</option>
                {SEMESTERS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.semester && <p className="mt-1 text-sm text-red-400">{errors.semester}</p>}
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-2">Subject (Optional)</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Data Structures"
                className="input-dark"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <label className="block text-white font-semibold mb-2">Tags</label>
          <p className="text-dark-400 text-sm mb-3">Add up to 5 tags to help others find your question</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 border border-primary-500/30">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.tags.length < 5 && (
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter..."
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-dark-400 outline-none focus:border-primary-500 min-w-[150px] flex-1"
              />
            )}
          </div>
          <p className="text-xs text-dark-400">{formData.tags.length}/5 tags</p>
        </div>

        {/* Anonymous */}
        <div className="card">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-primary-500 focus:ring-0"
            />
            <div>
              <span className="text-white font-medium">Post anonymously</span>
              <p className="text-sm text-dark-400">Your name won't be shown with this question</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-dark-400 text-sm">
            Posting as <span className="text-white font-medium">{formData.is_anonymous ? 'Anonymous' : user?.full_name}</span>
          </p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-dark-300 hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Post Question
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;