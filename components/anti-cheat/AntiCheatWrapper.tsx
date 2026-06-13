"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AlertTriangle, Eye, EyeOff, Maximize } from "lucide-react";

interface AntiCheatWrapperProps {
  children: React.ReactNode;
  maxViolations?: number;
  onViolation?: (count: number) => void;
  onAutoSubmit?: () => void;
  enabled?: boolean;
}

export default function AntiCheatWrapper({
  children,
  maxViolations = 3,
  onViolation,
  onAutoSubmit,
  enabled = true,
}: AntiCheatWrapperProps) {
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const violationsRef = useRef(0);

  const addViolation = useCallback((reason: string) => {
    if (!enabled) return;
    violationsRef.current += 1;
    setViolations(violationsRef.current);
    setWarning(`⚠️ ${reason} — Warning ${violationsRef.current}/${maxViolations}`);
    onViolation?.(violationsRef.current);
    setTimeout(() => setWarning(null), 4000);

    if (violationsRef.current >= maxViolations) {
      setWarning("🚨 Maximum violations reached! Auto-submitting...");
      setTimeout(() => onAutoSubmit?.(), 2000);
    }
  }, [enabled, maxViolations, onViolation, onAutoSubmit]);

  // Tab switch / focus loss detection
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        addViolation("Tab switch detected");
      }
    };

    const handleBlur = () => addViolation("Window focus lost");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [addViolation, enabled]);

  // Copy/paste restriction
  useEffect(() => {
    if (!enabled) return;

    const prevent = (e: ClipboardEvent) => {
      // Allow in Monaco editor (let Monaco handle it)
      const target = e.target as HTMLElement;
      if (target.closest(".monaco-editor")) return;
      e.preventDefault();
      addViolation("Copy/Paste attempt detected");
    };

    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, [addViolation, enabled]);

  // Right-click restriction
  useEffect(() => {
    if (!enabled) return;
    const prevent = (e: MouseEvent) => {
      e.preventDefault();
      addViolation("Right-click detected");
    };
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, [addViolation, enabled]);

  // Fullscreen enforcement
  const requestFullscreen = () => {
    document.documentElement.requestFullscreen?.();
    setIsFullscreen(true);
  };

  useEffect(() => {
    if (!enabled) return;
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        addViolation("Exited fullscreen mode");
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [addViolation, enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative">
      {/* Warning Banner */}
      {warning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-red-950 border border-red-500/50 text-red-200 px-6 py-3 rounded-xl shadow-2xl shadow-red-500/20 text-sm font-medium flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          {warning}
        </div>
      )}

      {/* Violation counter */}
      {violations > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-red-950/80 border border-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
          <AlertTriangle className="w-3 h-3" />
          {violations}/{maxViolations} violations
        </div>
      )}

      {/* Fullscreen prompt */}
      {!isFullscreen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a2e]/90 border border-white/10 text-slate-300 text-xs px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm">
          <Maximize className="w-3.5 h-3.5 text-purple-400" />
          <span>For best experience, use fullscreen mode</span>
          <button
            onClick={requestFullscreen}
            className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
          >
            Enter Fullscreen
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
