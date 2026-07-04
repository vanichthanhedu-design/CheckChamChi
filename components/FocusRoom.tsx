'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import TreeDisplay from './TreeDisplay';

export default function FocusRoom() {
  const [coinToast, setCoinToast] = useState<string | null>(null);
  const addCoins = useAppStore((s) => s.addCoins);
  const focusMode = useAppStore((state) => state.focusMode);
  const startFocus = useAppStore((state) => state.startFocus);
  const pauseFocus = useAppStore((state) => state.pauseFocus);
  const resumeFocus = useAppStore((state) => state.resumeFocus);
  const stopFocus = useAppStore((state) => state.stopFocus);
  const addTreeXP = useAppStore((state) => state.addTreeXP);

  const [elapsedDisplay, setElapsedDisplay] = useState(0);

  const handleStop = () => {
    const earned = Math.floor(elapsedDisplay); // tổng số phút
    if (earned > 0) {
      addCoins(earned);
      
      // Tính điểm kinh nghiệm dựa trên tỷ lệ quy đổi
      const earnedXP = Math.floor((earned / 45) * 100); 
      addTreeXP(earnedXP);

      setCoinToast(`🎉 Bạn đã nhận được ${earned} Coin và ${earnedXP}% tiến độ XP!`);
      setTimeout(() => setCoinToast(null), 4000);
    }
    stopFocus();
  };

  // Cập nhật đồng hồ
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusMode.status === 'running') {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed =
          focusMode.accumulatedSeconds +
          (focusMode.startTime ? (now - focusMode.startTime) / 1000 : 0);
        setElapsedDisplay(elapsed);
      }, 200);
    } else {
      setElapsedDisplay(focusMode.accumulatedSeconds);
    }
    return () => clearInterval(interval);
  }, [focusMode.status, focusMode.startTime, focusMode.accumulatedSeconds]);

  // Cộng XP mỗi phút
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusMode.status === 'running') {
      interval = setInterval(() => {
        addTreeXP(1);   // cộng XP cho cây (có sẵn)
        addCoins(1);    // mỗi phút +1 Coin
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [focusMode.status, addTreeXP, addCoins]);

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = focusMode.targetSeconds > 0 ? Math.max(0, focusMode.targetSeconds - elapsedDisplay) : null;

  const isIdle = focusMode.status === 'idle';
  const isRunning = focusMode.status === 'running';
  const isPaused = focusMode.status === 'paused';

  const bgStyle = focusMode.backgroundUrl
    ? { backgroundImage: `url(${focusMode.backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: '#f8fafc' };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={bgStyle}
    >
      {focusMode.backgroundUrl && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50" />
      )}

      <div className="relative z-10 text-center space-y-8 w-full max-w-xl px-4">
        {/* Hiển thị cây */}
        <TreeDisplay />

        {/* Đồng hồ */}
        <motion.div
          key={isRunning ? 'running' : 'paused'}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-8xl md:text-9xl font-bold text-gray-800 dark:text-white tracking-widest"
        >
          {formatTime(elapsedDisplay)}
        </motion.div>

        {focusMode.targetSeconds > 0 && (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Mục tiêu: {formatTime(focusMode.targetSeconds)}
            {remaining !== null && ` | Còn lại: ${formatTime(remaining)}`}
          </p>
        )}

        {/* POPUP HIỂN THỊ COIN - Đưa ra ngoài để không bị mất khi đổi trạng thái */}
        <AnimatePresence>
          {coinToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold z-50"
            >
              {coinToast}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 justify-center">
          {isIdle && (
            <button
              onClick={startFocus}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg transition transform hover:scale-105"
            >
              ▶️ Bắt đầu học
            </button>
          )}
          {isRunning && (
            <>
              <button
                onClick={pauseFocus}
                className="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-2xl shadow-lg transition"
              >
                ⏸ Tạm dừng
              </button>
              <button
                onClick={handleStop} // Sửa thành handleStop
                className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg transition"
              >
                ⏹ Kết thúc
              </button>
            </>
          )}
          {isPaused && (
            <>
              <button
                onClick={resumeFocus}
                className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg transition"
              >
                ▶️ Tiếp tục
              </button>
              <button
                onClick={handleStop} // Sửa thành handleStop
                className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg transition"
              >
                ⏹ Kết thúc
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}