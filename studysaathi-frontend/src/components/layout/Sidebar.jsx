import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  TrendingUp, 
  Bookmark, 
  Award,
  Users,
  HelpCircle,
  Flame
} from 'lucide-react';
import { FACULTIES } from '../../utils/constants';
import Badge from '../common/Badge';

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/questions', label: 'All Questions', icon: MessageSquare, count: 1234 },
    { path: '/trending', label: 'Trending', icon: Flame },
    { path: '/unanswered', label: 'Unanswered', icon: HelpCircle, count: 89 },
  ];

  const userLinks = [
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/my-questions', label: 'My Questions', icon: MessageSquare },
    { path: '/leaderboard', label: 'Leaderboard', icon: Award },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* Main Navigation */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 px-3">
            Navigate
          </h3>
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary-500/20 to-accent-purple/20 text-white border border-primary-500/30' 
                      : 'text-dark-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-primary-400' : ''} />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {link.count && (
                    <span className="text-xs text-dark-400">{link.count}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Section */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 px-3">
            Your Stuff
          </h3>
          <nav className="space-y-1">
            {userLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-dark-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Faculties */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 px-3">
            Faculties
          </h3>
          <div className="space-y-1">
            {FACULTIES.slice(0, 6).map((faculty) => (
              <Link
                key={faculty.value}
                to={`/questions?faculty=${faculty.value}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-dark-300 hover:bg-white/5 hover:text-white transition-all"
              >
                <Users size={16} />
                <span className="text-sm">{faculty.value}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="glass rounded-2xl p-5 bg-gradient-to-br from-primary-500/10 to-accent-purple/10">
          <h3 className="font-semibold text-white mb-4">Community Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold gradient-text">12.5K</p>
              <p className="text-xs text-dark-400">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold gradient-text-cyan">45.2K</p>
              <p className="text-xs text-dark-400">Answers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">8.9K</p>
              <p className="text-xs text-dark-400">Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">92%</p>
              <p className="text-xs text-dark-400">Solved</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;