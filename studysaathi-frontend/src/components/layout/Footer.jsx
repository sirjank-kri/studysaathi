import { Link } from 'react-router-dom';
import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-white/5 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={18} />
          </div>
          <span className="font-bold gradient-text">StudySaathi</span>
        </Link>

        <div className="flex items-center gap-6 text-dark-400 text-sm">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
        </div>

        <p className="text-dark-400 text-sm flex items-center gap-1">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> for TU Students
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;