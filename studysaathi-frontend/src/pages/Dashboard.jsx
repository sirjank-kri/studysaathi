import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Award, 
  Clock,
  CheckCircle,
  Star,
  Plus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await api.get('/dashboard/stats/');
      setStats(statsRes.data);

      // Fetch my questions
      const questionsRes = await api.get('/my-questions/');
      setMyQuestions(questionsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Questions Asked', value: stats?.questions_count || 0, icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { label: 'Answers Given', value: stats?.answers_count || 0, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Upvotes Received', value: stats?.total_upvotes || 0, icon: ThumbsUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Reputation', value: stats?.reputation || 0, icon: Star, color: 'from-yellow-500 to-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-2xl font-bold text-white">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.full_name}</h1>
            <p className="text-dark-400">{user?.faculty} • Semester {user?.semester}</p>
          </div>
        </div>
        <Link to="/ask" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Ask Question
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card group">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={24} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-dark-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* My Questions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-cyan-400" />
            My Questions
          </h2>
        </div>
        
        {myQuestions.length > 0 ? (
          <div className="space-y-3">
            {myQuestions.map((q) => (
              <Link 
                key={q.id} 
                to={`/questions/${q.id}`} 
                className="block p-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium line-clamp-1">{q.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-dark-400 text-sm">
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> {q.answers_count} answers
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={14} /> {q.upvotes}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${q.has_accepted_answer ? 'badge-green' : 'badge-yellow'}`}>
                    {q.has_accepted_answer ? 'Solved' : 'Open'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-dark-400 mb-4">You haven't asked any questions yet</p>
            <Link to="/ask" className="btn-primary">Ask Your First Question</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;