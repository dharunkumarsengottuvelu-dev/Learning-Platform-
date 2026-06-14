import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] max-w-lg mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-600/20">
        <Construction className="w-10 h-10 text-blue-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Coding Problems Details Test Cases</h1>
        <p className="text-slate-400 text-sm">
          This module is currently under active development. Our engineering team is working hard to bring you these features soon.
        </p>
      </div>
      <Link 
        href="/admin/dashboard" 
        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
