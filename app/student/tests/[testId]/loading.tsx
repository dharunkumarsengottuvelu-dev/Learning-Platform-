export default function TestDetailLoading() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      <div>
        <div className="h-7 bg-white/5 rounded w-1/2 mb-2" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-3 text-center h-20" />
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 border-b border-white/5">
            <div className="h-4 bg-white/5 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
