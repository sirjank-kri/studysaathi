import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Menu, X, Plus, Bell, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useQuestions } from '../../context/QuestionsContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useQuestions();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/questions', label: 'Questions' },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate('/questions');
  };

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    // Live search as you type
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">StudySaathi</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname === link.path ? 'text-white' : 'text-dark-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={`font-medium transition-colors ${
                  location.pathname === '/dashboard' ? 'text-white' : 'text-dark-300 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search questions, tags, subjects..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/ask" className="btn-primary flex items-center gap-2 text-sm">
                  <Plus size={18} />
                  <span className="hidden sm:inline">Ask</span>
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                        <div className="p-4 border-b border-white/10">
                          <p className="font-semibold text-white">{user.full_name}</p>
                          <p className="text-sm text-dark-400">{user.email}</p>
                          <p className="text-xs text-primary-400 mt-1">{user.faculty} • Sem {user.semester}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-200 hover:bg-white/5 hover:text-white"
                          >
                            <LayoutDashboard size={18} /> Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-200 hover:bg-white/5 hover:text-white"
                          >
                            <User size={18} /> Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                          >
                            <LogOut size={18} /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-dark-300 hover:text-white font-medium">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-dark-300 hover:text-white"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-dark-400"
                />
              </div>
            </form>
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-dark-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-dark-300 hover:text-white">
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;