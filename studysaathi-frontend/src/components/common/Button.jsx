const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-purple text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40',
  secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
  outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10',
  ghost: 'text-dark-200 hover:text-white hover:bg-white/5',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
  cyan: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
  xl: 'px-10 py-4 text-xl',
};

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  ...props 
}) => {
  const iconSize = size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 24 : 20;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative font-semibold rounded-xl transition-all duration-300 
        flex items-center justify-center gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:-translate-y-0.5 active:translate-y-0
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? <Spinner /> : Icon && <Icon size={iconSize} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;