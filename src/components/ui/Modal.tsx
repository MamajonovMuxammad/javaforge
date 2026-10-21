"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useHydrated } from "@/lib/progress/store";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" };

export function Modal({ open, onClose, title, subtitle, icon, children, footer, size = "md" }: ModalProps) {
  const hydrated = useHydrated();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !hydrated) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Закрыть" onClick={onClose} className="absolute inset-0 animate-fade-in cursor-default bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full ${SIZES[size]} max-h-[85vh] animate-scale-in overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60`}
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="relative flex items-start gap-3 border-b border-white/[0.06] px-6 py-5">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300 ring-1 ring-orange-400/20">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-zinc-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
            aria-label="Закрыть окно"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative max-h-[calc(85vh-9rem)] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="relative flex justify-end gap-2 border-t border-white/[0.06] px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
