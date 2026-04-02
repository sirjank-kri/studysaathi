const sizes = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
};

const Loader = ({ size = 'md', fullScreen = false }) => {
  const spinner = (
    <div className="relative">
      <div className={`${sizes[size]} rounded-full border-2 border-white/10`} />
      <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-t-primary-500 border-r-accent-purple animate-spin`} />
      <div className="absolute inset-2 rounded-full bg-primary-500/20 blur-sm animate-pulse" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-4">
        {spinner}
        <p className="text-dark-200 animate-pulse">Loading...</p>
      </div>
    );
  }

  return <div className="flex justify-center items-center p-8">{spinner}</div>;
};

export default Loader;