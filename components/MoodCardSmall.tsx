'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import MoodSelector from './MoodSelector';

export default function MoodCardSmall() {
  const today = new Date().toISOString().split('T')[0];
  const todayData = useAppStore((s) => s.checkinHistory[today]);
  const mood = todayData?.mood;
  const moodAdvice = todayData?.moodAdvice;
  const [open, setOpen] = useState(false);

  const moodEmojis: Record<string, string> = {
    stress: '😫',
    negative: '😔',
    neutral: '😐',
    happy: '😊',
    blissful: '😄',
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-md p-3 flex items-start gap-2 cursor-pointer hover:shadow-lg transition"
        onClick={() => setOpen(true)}
      >
        <span className="text-2xl">{mood ? moodEmojis[mood] : '😐'}</span>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-600">
            {mood ? mood : 'Chưa chọn'}
          </span>
          {moodAdvice && (
            <p className="text-xs text-gray-500 mt-1 italic">“{moodAdvice}”</p>
          )}
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <MoodSelector />
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}