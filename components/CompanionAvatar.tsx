'use client';

import { useAppStore } from '@/store/useAppStore';

export default function CompanionAvatar() {
  const currentStreak = useAppStore((state) => state.streaks.currentStreak);

  // Chọn emoji dựa vào streak
  let emoji = '🐶';
  let mood = 'Bình thường';
  if (currentStreak >= 30) {
    emoji = '🦸';
    mood = 'Siêu nhân!';
  } else if (currentStreak >= 7) {
    emoji = '😎';
    mood = 'Tự tin';
  } else if (currentStreak >= 1) {
    emoji = '😊';
    mood = 'Vui vẻ';
  } else {
    emoji = '😴';
    mood = 'Chưa có streak';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="text-6xl mb-2">{emoji}</div>
      <p className="text-sm font-medium text-gray-600">{mood}</p>
      <p className="text-xs text-gray-400 mt-1">
        {currentStreak > 0 ? `Streak: ${currentStreak} ngày` : 'Bắt đầu ngày mới thôi!'}
      </p>
    </div>
  );
}