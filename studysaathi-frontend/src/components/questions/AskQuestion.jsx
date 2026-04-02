import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, X, Plus } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { FACULTIES, SEMESTERS } from '../../utils/constants';
import { questionService } from '../../services/questionService';
import { useToast } from '../../hooks/useToast';

const AskQuestion = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    faculty: '',
    semester: '',
    subject: '',
    tags: [],
    is_anonymous: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length < 15) newErrors.title = 'Title must be at least 15 characters';
    if (!formData.content.trim()) newErrors.content = 'Description is required';
    if (formData.content.length < 30) newErrors.content = 'Please provide more details (min 30 characters)';
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
      const response = await questionService.createQuestion(formData);
      showSuccess('Question posted successfully!');
      navigate(`/questions/${response.id}`);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ask a Question</h1>
        <p className="text-dark-300">
          Get help from fellow TU students and our AI assistant
        </p>
      </div>

      {/* Tips Card */}
      <div className="glass rounded-2xl p-5 mb-6 bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border-primary-500/20">
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="glass rounded-2xl p-6">
          <label className="block text-white font-semibold mb-2">
            Question Title
          </label>
          <p className="text-dark-400 text-sm mb-3">
            Be specific and imagine you're asking a question to another person
          </p>
          <Input
            name="title"
            placeholder="e.g., How to implement binary search in C++?"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
        </div>

        {/* Description */}
        <div className="glass rounded-2xl p-6">
          <label className="block text-white font-semibold mb-2">
            Describe your problem
          </label>
          <p className="text-dark-400 text-sm mb-3">
            Include all the information someone would need to answer your question
          </p>
          <textarea
            name="content"
            rows={6}
            placeholder="Explain your question in detail. What have you tried so far? What specific help do you need?"
            value={formData.content}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-xl resize-none
              bg-white/5 border border-white/10
              text-white placeholder-dark-400
              outline-none transition-all duration-300
              focus:bg-white/8 focus:border-primary-500 focus:shadow-glow
              ${errors.content ? 'border-red-500/50' : ''}
            `}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-400">{errors.content}</p>
          )}
        </div>

        {/* Category Selection */}
        <div className="glass rounded-2xl p-6">
          <label className="block text-white font-semibold mb-4">
            Categorize your question
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Faculty"
              name="faculty"
              options={FACULTIES}
              value={formData.faculty}
              onChange={handleChange}
              error={errors.faculty}
            />
            <Select
              label="Semester"
              name="semester"
              options={SEMESTERS}
              value={formData.semester}
              onChange={handleChange}
              error={errors.semester}
            />
            <Input
              label="Subject (Optional)"
              name="subject"
              placeholder="e.g., Data Structures"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="glass rounded-2xl p-6">
          <label className="block text-white font-semibold mb-2">
            Tags
          </label>
          <p className="text-dark-400 text-sm mb-3">
            Add up to 5 tags to help others find your question
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 border border-primary-500/30"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.tags.length < 5 && (
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag..."
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-dark-400 outline-none focus:border-primary-500 w-32"
                />
              </div>
            )}
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="glass rounded-2xl p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-primary-500 focus:ring-primary-500"
            />
            <div>
              <span className="text-white font-medium">Post anonymously</span>
              <p className="text-sm text-dark-400">Your name won't be shown with this question</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={Send}
          >
            Post Question
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;