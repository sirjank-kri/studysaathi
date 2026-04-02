import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { FACULTIES, SEMESTERS } from '../../utils/constants';
import Button from '../common/Button';

const QuestionFilters = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('newest');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const tabs = [
    { id: 'newest', label: 'Newest' },
    { id: 'trending', label: 'Trending' },
    { id: 'unanswered', label: 'Unanswered' },
    { id: 'most-voted', label: 'Most Voted' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onFilterChange({ sort: tabId });
  };

  const handleFacultyChange = (faculty) => {
    setSelectedFaculty(faculty);
    onFilterChange({ faculty });
  };

  const clearFilters = () => {
    setSelectedFaculty('');
    setSelectedSemester('');
    onFilterChange({ faculty: '', semester: '' });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white shadow-lg' 
                  : 'text-dark-300 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={SlidersHorizontal}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {(selectedFaculty || selectedSemester) && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {[selectedFaculty, selectedSemester].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="glass rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Filter Questions</h3>
            {(selectedFaculty || selectedSemester) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Faculty Filter */}
            <div>
              <label className="block text-sm text-dark-300 mb-2">Faculty</label>
              <div className="flex flex-wrap gap-2">
                {FACULTIES.slice(0, 6).map((faculty) => (
                  <button
                    key={faculty.value}
                    onClick={() => handleFacultyChange(
                      selectedFaculty === faculty.value ? '' : faculty.value
                    )}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm transition-all
                      ${selectedFaculty === faculty.value
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                        : 'bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-transparent'
                      }
                    `}
                  >
                    {faculty.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm text-dark-300 mb-2">Semester</label>
              <div className="flex flex-wrap gap-2">
                {SEMESTERS.map((sem) => (
                  <button
                    key={sem.value}
                    onClick={() => {
                      const newSem = selectedSemester === sem.value ? '' : sem.value;
                      setSelectedSemester(newSem);
                      onFilterChange({ semester: newSem });
                    }}
                    className={`
                      w-9 h-9 rounded-lg text-sm font-medium transition-all
                      ${selectedSemester === sem.value
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-transparent'
                      }
                    `}
                  >
                    {sem.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-dark-300 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-transparent">
                  Solved
                </button>
                <button className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-transparent">
                  Unsolved
                </button>
                <button className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white border border-transparent">
                  AI Answered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionFilters;