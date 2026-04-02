import { ChevronDown } from 'lucide-react';

const Select = ({ label, error, options = [], className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-dark-200 mb-2">
        {label}
      </label>
    )}
    <div className="relative group">
      <select
        className={`
          w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
          bg-white/5 border text-white
          outline-none transition-all duration-300
          focus:bg-white/8 focus:border-primary-500 focus:shadow-glow
          hover:border-white/20
          ${error ? 'border-red-500/50' : 'border-white/10'}
          ${className}
        `}
        {...props}
      >
        <option value="" className="bg-dark-800">Select...</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value} className="bg-dark-800">
            {label}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={20}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none group-focus-within:text-primary-400 transition-colors" 
      />
    </div>
    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
  </div>
);

export default Select;