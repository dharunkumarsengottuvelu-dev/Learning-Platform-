import { Bell, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock notifications since there is no notifications table in the schema
const NOTIFICATIONS = [
  {
    id: "1",
    title: "Welcome to Training Compiler!",
    message: "We're glad to have you here. Start by exploring your courses or checking out the latest assessments assigned to you.",
    type: "info",
    createdAt: new Date(),
    read: false,
  },
  {
    id: "2",
    title: "New Test Assigned: DSA Round 1",
    message: "A new coding assessment has been assigned to you. Make sure to complete it before the deadline.",
    type: "alert",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
  },
  {
    id: "3",
    title: "Profile Successfully Created",
    message: "Your profile has been set up. You can now track your progress, view certificates, and compete on the leaderboard.",
    type: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
  }
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Stay updated with the latest alerts and announcements.</p>
        </div>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="glass-card divide-y divide-white/5">
        {NOTIFICATIONS.map((notification) => (
          <div key={notification.id} className={`p-5 flex gap-4 transition-colors hover:bg-white/[0.02] ${!notification.read ? 'bg-cyan-500/[0.02]' : ''}`}>
            <div className="shrink-0 mt-1">
              {notification.type === "info" && <Info className="w-5 h-5 text-cyan-400" />}
              {notification.type === "alert" && <ShieldAlert className="w-5 h-5 text-amber-400" />}
              {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={`text-sm font-semibold text-white ${!notification.read ? '' : 'text-slate-300'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {notification.message}
              </p>
            </div>
            
            {!notification.read && (
              <div className="shrink-0 flex items-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
