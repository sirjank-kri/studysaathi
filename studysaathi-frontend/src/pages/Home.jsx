import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  Users,
  BookOpen,
  Plus,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQuestions } from '../context/QuestionsContext';
import QuestionCard from '../components/questions/QuestionCard';

const stats = [
  { label: 'Students Joined', value: '2,400+', icon: Users },
  { label: 'Questions Answered', value: '8,100+', icon: MessageSquare },
  { label: 'Faculties Covered', value: '8', icon: BookOpen },
  { label: 'Avg. Response Time', value: '< 2hrs', icon: Clock },
];

const features = [
  {
    icon: MessageSquare,
    title: 'Ask Your Peers',
    description:
      'Get answers from seniors and batchmates who have been through the same syllabus and exams.',
    color: 'from-primary-500 to-accent-purple',
    badge: 'Community',
  },
  {
    icon: BookOpen,
    title: 'Organized by Syllabus',
    description:
      'Every question is tagged by faculty, semester, and subject — find exactly what you need.',
    color: 'from-cyan-400 to-blue-500',
    badge: 'Smart',
  },
  {
    icon: Award,
    title: 'Earn Reputation',
    description:
      'Help others and build your profile. The more you contribute, the higher you rank.',
    color: 'from-green-400 to-emerald-500',
    badge: 'Rewarding',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description:
      'See your questions, answers, and upvotes all in one personal dashboard.',
    color: 'from-pink-500 to-rose-500',
    badge: 'Personal',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create your account',
    description: 'Sign up with your email. Select your faculty and semester.',
  },
  {
    step: '02',
    title: 'Ask your question',
    description: 'Write your question, tag the subject, and post it to the community.',
  },
  {
    step: '03',
    title: 'Get answers fast',
    description: 'Fellow students answer. Accept the best one and help others find it.',
  },
];

// ── Guest Landing Page ────────────────────────────────────────
const GuestHome = ({ questions, loading }) => (
  <div className="space-y-28">

    {/* ── Hero ── */}
    <section className="text-center py-16 relative">
      {/* Subtle background glow - kept minimal */}
      <div className="absolute top-10 left-1/3 w-64 h-64 bg-primary-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-dark-200 font-medium">
            Made for Tribhuvan University students
          </span>
        </div>

        {/* Headline - warmer, more human */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          <span className="text-white">Study smarter,</span>
          <br />
          <span className="gradient-text">together.</span>
        </h1>

        <p className="text-lg text-dark-300 leading-relaxed max-w-xl mx-auto mb-10">
          StudySaathi is where TU students ask questions, share knowledge,
          and help each other pass — one answer at a time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
          >
            Join for Free <ArrowRight size={18} />
          </Link>
          <Link
            to="/questions"
            className="btn-secondary flex items-center gap-2 px-8 py-3.5"
          >
            Browse Questions
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-dark-500 text-sm mt-8">
          No credit card needed · Free forever for students
        </p>
      </div>
    </section>

    {/* ── Stats bar ── */}
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="card text-center group">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-500/20 transition-colors">
              <Icon size={20} className="text-primary-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-dark-400 text-xs">{stat.label}</p>
          </div>
        );
      })}
    </section>

    {/* ── Features ── */}
    <section>
      <div className="text-center mb-14">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Why students love it
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Built around how you{' '}
          <span className="gradient-text">actually study</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="card group cursor-default flex flex-col">
              {/* Badge */}
              <span className="self-start px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/5 text-dark-300 border border-white/8 mb-4">
                {feature.badge}
              </span>

              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
              >
                <Icon className="text-white" size={22} />
              </div>

              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>

    {/* ── How it works ── */}
    <section>
      <div className="text-center mb-14">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Simple by design
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Up and running in{' '}
          <span className="gradient-text">3 steps</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary-500/30 via-accent-purple/30 to-primary-500/30" />

        {howItWorks.map((item, i) => (
          <div key={i} className="card text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 border border-primary-500/20 flex items-center justify-center mx-auto mb-5">
              <span className="text-xl font-bold gradient-text">{item.step}</span>
            </div>
            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
            <p className="text-dark-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Recent Questions ── */}
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            What students are asking
          </h2>
          <p className="text-dark-400 text-sm">
            Real questions from your community, right now
          </p>
        </div>
        <Link
          to="/questions"
          className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-3">
          {questions.slice(0, 5).map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <MessageSquare size={32} className="text-dark-500 mx-auto mb-4" />
          <p className="text-dark-400 mb-4">
            No questions yet. Be the first to ask!
          </p>
          <Link to="/signup" className="btn-primary inline-flex">
            Get Started
          </Link>
        </div>
      )}
    </section>

    {/* ── CTA ── */}
    <section className="card border-primary-500/20 text-center py-16 px-8 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-purple/5 pointer-events-none" />

      <div className="relative">
        {/* Checkmarks */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-8">
          {['Free forever', 'No spam', 'Built for TU', 'Community driven'].map(
            (item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-dark-300 text-sm"
              >
                <CheckCircle size={14} className="text-green-400" />
                {item}
              </span>
            )
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Your classmates are already here.
        </h2>
        <p className="text-dark-300 max-w-lg mx-auto mb-8 leading-relaxed">
          Stop searching alone. Join StudySaathi and get answers from people
          who know your exact syllabus.
        </p>
        <Link
          to="/signup"
          className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4"
        >
          Create Free Account <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  </div>
);

// ── Logged In Home ────────────────────────────────────────────
const UserHome = ({ user, questions, loading }) => (
  <div className="space-y-8">

    {/* Welcome */}
    <section className="card bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border-primary-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Greeting based on time */}
          <p className="text-dark-400 text-sm mb-1">
            {new Date().getHours() < 12
              ? 'Good morning'
              : new Date().getHours() < 17
              ? 'Good afternoon'
              : 'Good evening'}
            , 👋
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {user?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-dark-400 text-sm">
            {user?.faculty} · Semester {user?.semester}
          </p>
        </div>
        <Link to="/ask" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={18} /> Ask a Question
        </Link>
      </div>
    </section>

    {/* Quick Links */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'Browse All', to: '/questions', icon: MessageSquare, color: 'text-primary-400' },
        { label: 'Ask Question', to: '/ask', icon: Plus, color: 'text-green-400' },
        { label: 'My Questions', to: '/dashboard', icon: BookOpen, color: 'text-cyan-400' },
        { label: 'My Profile', to: '/profile', icon: Users, color: 'text-pink-400' },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            to={item.to}
            className="card flex flex-col items-center gap-2 py-5 text-center hover:border-white/15 transition-all"
          >
            <Icon size={20} className={item.color} />
            <span className="text-sm text-dark-200 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>

    {/* Recent Questions */}
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Recent Questions</h2>
        <Link
          to="/questions"
          className="text-primary-400 text-sm hover:text-primary-300 font-medium"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-3">
          {questions.slice(0, 5).map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-10">
          <p className="text-dark-400 mb-4">No questions yet. Ask the first one!</p>
          <Link to="/ask" className="btn-primary inline-flex">
            Ask Question
          </Link>
        </div>
      )}
    </section>
  </div>
);

// ── Main export ───────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const { questions, loading, fetchQuestions } = useQuestions();

  useEffect(() => {
    fetchQuestions({ sort: 'newest' });
  }, []);

  return user ? (
    <UserHome user={user} questions={questions} loading={loading} />
  ) : (
    <GuestHome questions={questions} loading={loading} />
  );
};

export default Home;