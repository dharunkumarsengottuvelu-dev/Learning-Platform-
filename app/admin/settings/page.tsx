import { Settings, Save, Server, Globe, BellRing, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure global preferences, branding, and system defaults.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-blue-700/20 text-blue-400 border border-blue-600/20">
            <Globe className="w-4 h-4" />
            General
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <Server className="w-4 h-4" />
            System
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <BellRing className="w-4 h-4" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <ShieldCheck className="w-4 h-4" />
            Security
          </button>
        </div>

        <div className="md:col-span-3 glass-card p-6 space-y-6">
          <div className="space-y-4 border-b border-white/5 pb-6">
            <h3 className="text-lg font-semibold text-white">General Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="Training Compiler"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@trainingcompiler.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-b border-white/5 pb-6">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Primary Color Theme</label>
              <div className="flex gap-3 mt-2">
                <button className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-white ring-offset-2 ring-offset-[#020617]" />
                <button className="w-8 h-8 rounded-full bg-blue-500 opacity-50 hover:opacity-100 transition-opacity" />
                <button className="w-8 h-8 rounded-full bg-emerald-500 opacity-50 hover:opacity-100 transition-opacity" />
                <button className="w-8 h-8 rounded-full bg-rose-500 opacity-50 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-blue-600/25">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
