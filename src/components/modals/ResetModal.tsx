"use client";

import { Modal } from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";
import { resetProgress } from "@/lib/progress/store";
import { useToast } from "@/components/ui/Toaster";

interface ResetModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResetModal({ open, onClose }: ResetModalProps) {
  const toast = useToast();

  const handleConfirm = () => {
    resetProgress();
    toast({
      variant: "info",
      title: "Прогресс сброшен",
      description: "Все выполненные дни, сохранённый код и ачивки были очищены.",
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Сброс прогресса"
      subtitle="Это действие нельзя отменить"
      icon={<AlertTriangle className="h-5 w-5 text-rose-400" />}
      size="sm"
      footer={
        <div className="flex w-full items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-zinc-800/80 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-rose-600/90 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-950/40 transition hover:bg-rose-500"
          >
            Да, сбросить всё
          </button>
        </div>
      }
    >
      <div className="space-y-3 text-sm text-zinc-300">
        <p>
          Вы уверены, что хотите сбросить весь прогресс обучения?
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
          <li>Все заработанные очки XP будут обнулены</li>
          <li>Стрик дней вернётся к 0</li>
          <li>Все открытые ачивки будут заблокированы</li>
          <li>Все сохранённые решения в редакторе будут удалены</li>
        </ul>
        <p className="text-xs text-zinc-400">
          Эта функция полезна для повторного прохождения программы с нуля или для тестирования платформы.
        </p>
      </div>
    </Modal>
  );
}
