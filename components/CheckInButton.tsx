'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

export default function CheckInButton() {
  const today = new Date().toISOString().split('T')[0];
  const checkinData = useAppStore((state) => state.checkinHistory[today]);
  const checkinToday = useAppStore((state) => state.checkinToday);
  const isCheckedIn = checkinData?.status === 'completed';

  const handleClick = () => {
    if (!isCheckedIn) {
      checkinToday();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={isCheckedIn}
      className={`px-10 py-5 rounded-2xl text-xl font-bold shadow-lg transition-colors duration-300 ${
        isCheckedIn
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
      }`}
    >
      {isCheckedIn ? '✅ Đã điểm danh hôm nay' : '📅 ĐIỂM DANH HÔM NAY'}
    </motion.button>
  );
}