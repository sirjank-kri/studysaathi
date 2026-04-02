const Input = ({ label, error, icon: Icon, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-dark-200 mb-2">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <Icon 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors" 
        />
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/5 border text-white placeholder-dark-400
          outline-none transition-all duration-300
          focus:bg-white/8 focus:border-primary-500 focus:shadow-glow
          hover:border-white/20
          ${Icon ? 'pl-12' : ''}
          ${error ? 'border-red-500/50' : 'border-white/10'}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

export default Input;