import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown,
  MessageSquare, 
  Clock, 
  Eye, 
  Bookmark, 
  CheckCircle,
  Send,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQuestions } from '../context/QuestionsContext';
import toast from 'react-hot-toast';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getQuestionById, voteQuestion, voteAnswer, createAnswer, acceptAnswer } = useQuestions();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userQuestionVote, setUserQuestionVote] = useState(0);
  const [userAnswerVotes, setUserAnswerVotes] = useState({});

  // Fetch question on mount
  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    setLoading(true);
    const data = await getQuestionById(id);
    if (data) {
      setQuestion(data);
    }
    setLoading(false);
  };

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

  const handleQuestionVote = async (voteType) => {
    if (!user) {
      toast.error('Please login to vote');
      navigate('/login');
      return;
    }
    
    try {
      await voteQuestion(id, voteType);
      // Toggle vote state
      if (userQuestionVote === (voteType === 'upvote' ? 1 : -1)) {
        setUserQuestionVote(0);
      } else {
        setUserQuestionVote(voteType === 'upvote' ? 1 : -1);
      }
      // Reload question to get updated vote count
      loadQuestion();
      toast.success(voteType === 'upvote' ? 'Upvoted!' : 'Downvoted!');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleAnswerVote = async (answerId, voteType) => {
    if (!user) {
      toast.error('Please login to vote');
      navigate('/login');
      return;
    }
    
    try {
      await voteAnswer(answerId, voteType);
      // Toggle vote state
      const currentVote = userAnswerVotes[answerId] || 0;
      const newVote = currentVote === (voteType === 'upvote' ? 1 : -1) ? 0 : (voteType === 'upvote' ? 1 : -1);
      setUserAnswerVotes(prev => ({ ...prev, [answerId]: newVote }));
      loadQuestion();
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    if (!user || user.id !== question.author.id) {
      toast.error('Only question author can accept answers');
      return;
    }
    
    try {
      await acceptAnswer(answerId);
      toast.success('Answer accepted!');
      loadQuestion();
    } catch (error) {
      toast.error('Failed to accept answer');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to answer');
      navigate('/login');
      return;
    }

    if (!newAnswer.trim()) {
      toast.error('Please write an answer');
      return;
    }

    setSubmitting(true);
    try {
      await createAnswer(id, newAnswer);
      toast.success('Answer posted!');
      setNewAnswer('');
      loadQuestion(); // Reload to show new answer
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const formatContent = (content) => {
    if (!content) return null;
    return content.split('```').map((part, index) => {
      if (index % 2 === 1) {
        const lines = part.split('\n');
        const code = lines.slice(1).join('\n') || part;
        return (
          <pre key={index} className="bg-dark-900 border border-white/10 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono">{code}</code>
          </pre>
        );
      }
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.split('**').map((text, i) => 
            i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{text}</strong> : text
          )}
        </span>
      );
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (!question) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Question not found</h2>
        <Link to="/questions" className="btn-primary">Browse Questions</Link>
      </div>
    );
  }

  const answers = question.answers || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link to="/questions" className="inline-flex items-center gap-2 text-dark-300 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Questions
      </Link>

      {/* Question */}
      <div className="card mb-6">
        <div className="flex gap-4">
          {/* Vote Column */}
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => handleQuestionVote('upvote')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                userQuestionVote === 1 ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-dark-300 hover:bg-white/10'
              }`}
            >
              <ArrowUp size={20} />
            </button>
            <span className={`text-xl font-bold ${userQuestionVote !== 0 ? 'text-primary-400' : 'text-white'}`}>
              {question.upvotes}
            </span>
            <button 
              onClick={() => handleQuestionVote('downvote')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                userQuestionVote === -1 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-dark-300 hover:bg-white/10'
              }`}
            >
              <ArrowDown size={20} />
            </button>
            <button className="mt-2 p-2 text-dark-400 hover:text-yellow-400">
              <Bookmark size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge badge-purple">{question.faculty}</span>
              <span className="badge badge-cyan">Sem {question.semester}</span>
              {question.subject && <span className="badge badge-pink">{question.subject}</span>}
              {question.has_accepted_answer && (
                <span className="badge badge-green flex items-center gap-1">
                  <CheckCircle size={12} /> Solved
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">{question.title}</h1>
            
            <div className="text-dark-200 leading-relaxed mb-6">
              {formatContent(question.content)}
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-sm rounded-lg bg-white/5 text-dark-300">#{tag}</span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-dark-400 text-sm">
                <span className="flex items-center gap-1"><Eye size={16} /> {question.views}</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {timeAgo(question.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {question.is_anonymous ? 'A' : question.author?.full_name?.charAt(0)}
                  </span>
                </div>
                <p className="text-white text-sm">
                  {question.is_anonymous ? 'Anonymous' : question.author?.full_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <MessageSquare size={22} /> {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* Answers List */}
      {answers.length > 0 ? (
        <div className="space-y-4 mb-8">
          {answers.map((answer) => (
            <div key={answer.id} className={`card ${answer.is_accepted ? 'border-green-500/30 bg-green-500/5' : ''}`}>
              <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => handleAnswerVote(answer.id, 'upvote')}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      userAnswerVotes[answer.id] === 1 ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-dark-300 hover:bg-white/10'
                    }`}
                  >
                    <ArrowUp size={18} />
                  </button>
                  <span className="font-bold text-white">{answer.upvotes}</span>
                  <button 
                    onClick={() => handleAnswerVote(answer.id, 'downvote')}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      userAnswerVotes[answer.id] === -1 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-dark-300 hover:bg-white/10'
                    }`}
                  >
                    <ArrowDown size={18} />
                  </button>
                  
                  {/* Accept Answer Button (only for question author) */}
                  {user && user.id === question.author?.id && (
                    <button
                      onClick={() => handleAcceptAnswer(answer.id)}
                      className={`mt-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        answer.is_accepted 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-white/5 text-dark-400 hover:bg-green-500/10 hover:text-green-400'
                      }`}
                      title={answer.is_accepted ? 'Accepted answer' : 'Accept this answer'}
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  
                  {/* Show accepted badge for others */}
                  {(!user || user.id !== question.author?.id) && answer.is_accepted && (
                    <div className="mt-2 w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <CheckCircle size={18} className="text-green-400" />
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1 min-w-0">
                  {answer.is_accepted && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-semibold mb-3">
                      <CheckCircle size={12} /> Accepted Answer
                    </div>
                  )}
                  
                  <div className="text-dark-200 leading-relaxed mb-4">
                    {formatContent(answer.content)}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-dark-400 text-sm">{timeAgo(answer.created_at)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{answer.author?.full_name?.charAt(0)}</span>
                      </div>
                      <p className="text-white text-sm">{answer.author?.full_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-8 mb-8">
          <p className="text-dark-400">No answers yet. Be the first to answer!</p>
        </div>
      )}

      {/* Post Answer Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Send size={20} className="text-primary-400" /> Your Answer
        </h3>
        
        {user ? (
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here... You can use **bold** and ```code blocks```"
              rows={6}
              className="input-dark resize-none mb-4"
            />
            <div className="flex items-center justify-between">
              <p className="text-dark-400 text-sm">
                Answering as <span className="text-white">{user.full_name}</span>
              </p>
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Post Answer
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-dark-300 mb-4">Login to post an answer</p>
            <Link to="/login" className="btn-primary inline-block">Login to Answer</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;