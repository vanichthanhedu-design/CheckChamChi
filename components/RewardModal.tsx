'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function RewardModal() {
  const [lastReward, setLastReward] = useState<any>(null);
  const rewardHistory = useAppStore((state) => state.rewardHistory);
  const rewards = useAppStore((state) => state.rewards);

  // Mỗi khi rewardHistory thay đổi (có phần thưởng mới), lấy phần tử cuối cùng
  useEffect(() => {
    if (rewardHistory.length > 0) {
      const latestEntry = rewardHistory[rewardHistory.length - 1];
      const reward = rewards.find(r => r.id === latestEntry.rewardId);
      setLastReward(reward);
      // Tự động tắt modal sau 5 giây
      const timer = setTimeout(() => setLastReward(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [rewardHistory, rewards]);

  if (!lastReward) return null;

  // Xác định màu sắc theo độ hiếm
  const rarityColors: any = {
    common: 'bg-gray-200 text-gray-800',
    normal: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    rare: 'bg-purple-100 text-purple-800',
    super_rare: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-10 right-10 z-50"
      >
        <div className={`p-5 rounded-2xl shadow-2xl ${rarityColors[lastReward.rarity] || 'bg-white'} max-w-sm`}>
          <h3 className="text-lg font-bold">🎉 Chúc mừng! Bạn nhận được:</h3>
          <p className="text-2xl font-extrabold mt-2">{lastReward.name}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-50">
            {lastReward.rarity === 'common' ? '⭐ Phổ biến' :
             lastReward.rarity === 'normal' ? '⭐⭐ Bình thường' :
             lastReward.rarity === 'good' ? '⭐⭐⭐ Tốt' :
             lastReward.rarity === 'rare' ? '🌟🌟 Hiếm' :
             '💎 Siêu hiếm'}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
