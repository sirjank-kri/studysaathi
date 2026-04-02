const variants = {
  purple: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  green: 'bg-green-500/20 text-green-300 border-green-500/30',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const Badge = ({ children, variant = 'purple', className = '' }) => (
  <span className={`
    inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
    border backdrop-blur-sm ${variants[variant]} ${className}
  `}>
    {children}
  </span>
);

export default Badge;