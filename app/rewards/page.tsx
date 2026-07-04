'use client'; // Bắt buộc vì dùng state và event

import { useState } from 'react';
import RewardManager from '@/components/RewardManager';
import LuckyWheel from '@/components/LuckyWheel';
import { useAppStore } from '@/store/useAppStore';

export default function RewardsPage() {
  const spinWheel = useAppStore((state) => state.spinWheel);
  const [targetRewardId, setTargetRewardId] = useState<number | null>(null);
  const [showWheel, setShowWheel] = useState(false);

  const handleTestSpin = () => {
    const won = spinWheel(); // gọi spinWheel thật, lưu vào rewardHistory
    if (won) {
      setTargetRewardId(won.id);
      setShowWheel(true);
    }
  };

  const handleCloseWheel = () => {
    setShowWheel(false);
    setTargetRewardId(null);
  };

  return (
    <div className="flex gap-8 p-8 max-w-7xl mx-auto">
      {/* Cột trái: Quản lý phần thưởng */}
      <div className="flex-1">
        <RewardManager />
      </div>

      {/* Cột phải: Vòng quay thử */}
      <div className="w-96 flex flex-col items-center">
        {!showWheel ? (
          <div className="text-center p-8 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">🎡 Quay thử phần thưởng</h3>
            <p className="text-gray-500 mb-6">Nhấn nút bên dưới để quay ngẫu nhiên một phần thưởng dựa trên xác suất bạn đã thiết lập.</p>
            <button
              onClick={handleTestSpin}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
            >
              Quay thử
            </button>
          </div>
        ) : (
          <div className="w-full">
            <LuckyWheel targetRewardId={targetRewardId!} onSpinEnd={handleCloseWheel} />
            <button
              onClick={handleCloseWheel}
              className="mt-4 w-full py-2 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}