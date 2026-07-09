export default function CodingProblemLoading() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#020617]">
      {/* Left panel skeleton */}
      <div className="w-[40%] flex flex-col border-r border-white/5 p-4 gap-4 animate-pulse">
        <div className="h-5 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-1/4" />
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-white/5 rounded" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
          <div className="h-4 bg-white/5 rounded w-4/5" />
          <div className="h-4 bg-white/5 rounded w-3/4" />
        </div>
        <div className="h-24 bg-white/5 rounded mt-4" />
      </div>
      {/* Right panel skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 bg-[#0f172a] border-b border-white/5" />
        <div className="flex-1 bg-[#1e1e1e]" />
      </div>
    </div>
  );
}
