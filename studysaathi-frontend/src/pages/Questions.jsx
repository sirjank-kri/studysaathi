import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MessageSquare } from 'lucide-react';
import { useQuestions } from '../context/QuestionsContext';
import { FACULTIES, SEMESTERS } from '../utils/constants';
import QuestionCard from '../components/questions/QuestionCard';

const Questions = () => {
  const { questions, loading, searchQuery, setSearchQuery, fetchQuestions } = useQuestions();
  const [activeTab, setActiveTab] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ faculty: '', semester: '' });
  
  const tabs = [
    { id: 'newest', label: 'Newest' },
    { id: 'trending', label: 'Trending' },
    { id: 'unanswered', label: 'Unanswered' },
    { id: 'most-voted', label: 'Most Voted' },
  ];

  // Fetch questions on mount and when filters change
  useEffect(() => {
    fetchQuestions({ ...filters, sort: activeTab });
  }, [activeTab, filters.faculty, filters.semester]);

  // Fetch when search changes (with debounce effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions({ ...filters, sort: activeTab });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ faculty: '', semester: '' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.faculty || filters.semester || searchQuery;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Questions</h1>
          <p className="text-dark-400">
            {questions.length} question{questions.length !== 1 ? 's' : ''} 
            {searchQuery && <span> matching "<span className="text-primary-400">{searchQuery}</span>"</span>}
          </p>
        </div>
        <Link to="/ask" className="btn-primary w-fit">Ask Question</Link>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white'
                  : 'text-dark-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-white/10' : ''}`}
        >
          <SlidersHorizontal size={18} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {[filters.faculty, filters.semester, searchQuery].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Filter Questions</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                <X size={14} /> Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-dark-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keywords..."
                  className="input-dark pl-9 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-2">Faculty</label>
              <select
                value={filters.faculty}
                onChange={(e) => handleFilterChange('faculty', e.target.value)}
                className="select-dark py-2"
              >
                <option value="">All Faculties</option>
                {FACULTIES.map(f => (
                  <option key={f.value} value={f.value}>{f.value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-2">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="select-dark py-2"
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => (
                  <option key={s.value} value={s.value}>Semester {s.value}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <MessageSquare size={32} className="text-dark-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No questions yet</h3>
          <p className="text-dark-400 mb-6">
            {searchQuery ? `No results for "${searchQuery}"` : 'Be the first to ask a question!'}
          </p>
          <div className="flex items-center justify-center gap-4">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            )}
            <Link to="/ask" className="btn-primary">Ask Question</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;