import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Users, Sparkles, BookOpen, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQuestions } from '../context/QuestionsContext';
import QuestionCard from '../components/questions/QuestionCard';

const features = [
  {
    icon: MessageSquare,
    title: 'Ask & Answer',
    description: 'Get help from fellow TU students who understand your syllabus',
    color: 'from-primary-500 to-accent-purple',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Get instant AI responses while waiting for peer answers',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Curriculum Mapped',
    description: 'Questions organized by faculty, semester, and subject',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join thousands of TU students helping each other',
    color: 'from-pink-500 to-rose-500',
  },
];

// Guest landing page
const GuestHome = ({ questions, loading }) => (
  <div className="space-y-24">
    {/* Hero */}
    <section className="text-center py-16 relative">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-dark-200">Built for TU Students</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-white">Your Academic</span>
          <br />
          <span className="gradient-text">Study Partner</span>
        </h1>

        <p className="text-xl text-dark-300 max-w-2xl mx-auto mb-10">
          An AI-powered Q&A platform built for Tribhuvan University students.
          Ask questions, get answers, and ace your exams together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
            Get Started Free <ArrowRight size={20} />
          </Link>
          <Link to="/questions" className="btn-secondary flex items-center gap-2 px-8 py-4">
            Browse Questions
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Everything you need to <span className="gradient-text">succeed</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="card group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-dark-400 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>

    {/* Recent Questions */}
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Recent Questions</h2>
          <p className="text-dark-400">See what students are asking</p>
        </div>
        <Link to="/questions" className="flex items-center gap-2 text-primary-400 hover:text-primary-300">
          View All <ArrowRight size={18} />
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.slice(0, 5).map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-dark-400 mb-4">No questions yet. Be the first to ask!</p>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      )}
    </section>

    {/* CTA */}
    <section className="card bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border-primary-500/20 text-center py-12">
      <h2 className="text-3xl font-bold text-white mb-4">Ready to ace your exams?</h2>
      <p className="text-dark-300 max-w-xl mx-auto mb-8">
        Join TU students using StudySaathi to get better grades.
      </p>
      <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
        Join StudySaathi Today <ArrowRight size={20} />
      </Link>
    </section>
  </div>
);

// Logged in user home
const UserHome = ({ user, questions, loading }) => (
  <div className="space-y-8">
    {/* Welcome Header */}
    <section className="card bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border-primary-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-dark-300">
            {user?.faculty} • Semester {user?.semester}
          </p>
        </div>
        <Link to="/ask" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Ask Question
        </Link>
      </div>
    </section>

    {/* Recent Questions */}
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Questions</h2>
        <Link to="/questions" className="text-primary-400 text-sm hover:underline">
          View all
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.slice(0, 5).map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-8">
          <p className="text-dark-400 mb-4">No questions yet. Ask the first one!</p>
          <Link to="/ask" className="btn-primary">Ask Question</Link>
        </div>
      )}
    </section>
  </div>
);

// Main component
const Home = () => {
  const { user } = useAuth();
  const { questions, loading, fetchQuestions } = useQuestions();

  useEffect(() => {
    fetchQuestions({ sort: 'newest' });
  }, []);

  return user 
    ? <UserHome user={user} questions={questions} loading={loading} />
    : <GuestHome questions={questions} loading={loading} />;
};

export default Home;