import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowUp, Eye, Clock, CheckCircle, Bookmark, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const QuestionCard = ({ question }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(question.upvotes || 0);

  const {
    id,
    title,
    content,
    author,
    faculty,
    semester,
    tags = [],
    answers_count = 0,
    views = 0,
    created_at,
    has_accepted_answer = false,
  } = question;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleUpvote = () => {
    if (!user) {
      toast.error('Please login to upvote', {
        icon: <LogIn size={18} />,
      });
      navigate('/login');
      return;
    }
    
    if (upvoted) {
      setUpvoteCount(prev => prev - 1);
      setUpvoted(false);
    } else {
      setUpvoteCount(prev => prev + 1);
      setUpvoted(true);
      toast.success('Upvoted!');
    }
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark');
      navigate('/login');
      return;
    }
    toast.success('Bookmarked!');
  };

  return (
    <div className="card hover:border-white/15 transition-all duration-300">
      <div className="flex gap-4">
        
        {/* Stats Column */}
        <div className="hidden sm:flex flex-col items-center gap-3 text-center min-w-[60px]">
          
          {/* Upvote */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleUpvote}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                upvoted 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : 'bg-white/5 text-dark-300 hover:bg-primary-500/10 hover:text-primary-400'
              }`}
            >
              <ArrowUp size={18} />
            </button>
            <span className={`text-sm font-semibold mt-1 ${upvoted ? 'text-primary-400' : 'text-white'}`}>
              {upvoteCount}
            </span>
          </div>
          
          {/* Answers */}
          <div className={`flex flex-col items-center ${has_accepted_answer ? 'text-green-400' : 'text-dark-400'}`}>
            {has_accepted_answer ? <CheckCircle size={18} /> : <MessageSquare size={18} />}
            <span className="text-sm mt-1">{answers_count}</span>
          </div>
          
          {/* Views */}
          <div className="flex flex-col items-center text-dark-400">
            <Eye size={16} />
            <span className="text-xs mt-1">{views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge badge-purple">{faculty}</span>
            <span className="badge badge-cyan">Sem {semester}</span>
            {has_accepted_answer && <span className="badge badge-green">Solved</span>}
          </div>

          {/* Title */}
          <Link to={`/questions/${id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-primary-400 transition-colors mb-2 line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Preview */}
          <p className="text-dark-300 text-sm mb-3 line-clamp-2">{content}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="px-2 py-1 text-xs rounded-lg bg-white/5 text-dark-300 hover:bg-white/10 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {author?.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="text-sm text-dark-300">{author?.full_name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-1 text-dark-400 text-sm">
                <Clock size={14} />
                <span>{timeAgo(created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Bookmark */}
              <button 
                onClick={handleBookmark}
                className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Bookmark size={16} />
              </button>
              
              {/* Mobile Stats */}
              <div className="flex sm:hidden items-center gap-3 text-dark-400 text-sm">
                <span className="flex items-center gap-1">
                  <ArrowUp size={14} /> {upvoteCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} /> {answers_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;