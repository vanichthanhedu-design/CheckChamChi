'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import GreetingCard from './GreetingCard';
import InfoCard from './InfoCard';
import ProgressCircle from './ProgressCircle';
import CheckInButton from './CheckInButton';
import MissionGroup from './MissionGroup';
import { useState, useEffect } from 'react';
import { shouldRemindBackup, autoBackup, updateLastBackupDate } from '@/utils/backup';
import TitleUnlockToast from './TitleUnlockToast';
import { ALL_TITLES } from '@/config/titles';
import PetCompanion from './PetCompanion';

export default function Dashboard() {
const profile = useAppStore((state) => state.profile);
const streaks = useAppStore((state) => state.streaks);
const today = new Date().toISOString().split('T')[0];
const rewardHistory = useAppStore((state) => state.rewardHistory);
const rewards = useAppStore((state) => state.rewards);
const [showBackupReminder, setShowBackupReminder] = useState(false);

useEffect(() => {
  setShowBackupReminder(shouldRemindBackup());
}, []);

const handleBackupNow = () => {
  autoBackup(); // Tải file backup
  setShowBackupReminder(false); // Ẩn reminder, autoBackup đã tự update ngày backup
};

const handleDismissReminder = () => {
  updateLastBackupDate(); // Coi như đã nhắc, không nhắc lại trong 7 ngày tới
  setShowBackupReminder(false);
};
const equippedTitleId = useAppStore((state) => state.equippedTitle);
const userTitles = useAppStore((state) => state.userTitles);
  
  const titleDef = equippedTitleId ? ALL_TITLES.find(t => t.id === equippedTitleId) : null;
  const equippedTitle = titleDef ? { icon: titleDef.icon, name: titleDef.name } : null;

  // Lấy thông tin danh hiệu mới để làm thông báo Toast
  const newTitleId = useAppStore((s) => s.newTitleId);
  const clearNewTitle = useAppStore((s) => s.clearNewTitle);
  const newTitleDef = newTitleId 
    ? ALL_TITLES.find(t => t.id === newTitleId) 
    : null;

useEffect(() => {
  if (newTitleId) {
    // Sau 5 giây (5000ms), tự động xóa newTitleId trong store để ẩn thông báo
    const timer = setTimeout(() => {
      clearNewTitle();
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [newTitleId, clearNewTitle]);

  const todayRewardEntries = useMemo(() => {
    return rewardHistory
      .filter(entry => entry.wonAt.split('T')[0] === today)
      .map(entry => {
        const reward = rewards.find(r => r.id === entry.rewardId);
        return reward ? reward.name : 'Không xác định';
      });
  }, [rewardHistory, rewards, today]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Hàng 1: Thẻ tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GreetingCard username={profile.username} equippedTitle={equippedTitle} />
        <InfoCard icon="🔥" label="Streak hiện tại" value={`${streaks.currentStreak} ngày`} />
        <InfoCard icon="🏆" label="Streak dài nhất" value={`${streaks.longestStreak} ngày`} />
        <InfoCard icon="🪙" label="Coin" value={profile.coins.toString()} />
      </div>
      {newTitleDef && (
       <TitleUnlockToast 
  titleName={newTitleDef.name} 
  titleIcon={newTitleDef.icon} 
  onClose={clearNewTitle}
/>
      )}
      {/* Hàng 2: 3 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Cột trái: Learning */}
        <div className="lg:col-span-3">
          <MissionGroup group="learning" />
        </div>

        {/* Cột giữa: Tiến độ + Điểm danh + Phần thưởng */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <ProgressCircle />
          <div className="mt-6">
            <CheckInButton />
          </div>
          {/* Phần thưởng hôm nay */}
          <div className="w-full mt-8 bg-white rounded-2xl shadow-md border border-gray-200 p-5">
            <h3 className="text-xl font-semibold mb-3">🎁 Phần thưởng hôm nay</h3>
            {todayRewardEntries.length === 0 ? (
              <p className="text-gray-400 text-sm">Chưa có phần thưởng nào.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {todayRewardEntries.map((name, idx) => (
                  <li key={idx} className="text-gray-700">{name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Cột phải: Physical */}
        <div className="lg:col-span-3">
          <MissionGroup group="physical" />
        </div>
      </div>
      {showBackupReminder && (
  <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-4 pr-10 rounded-xl shadow-lg z-50 relative">
    <button
      onClick={handleDismissReminder}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg leading-none"
      aria-label="Đóng"
    >
      ✕
    </button>
    <p className="text-sm mb-3">💾 Đã lâu bạn chưa sao lưu dữ liệu. Hãy sao lưu để bảo vệ thành quả.</p>
    <button
      onClick={handleBackupNow}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
    >
      📥 Sao lưu ngay
    </button>
  </div>
)}
{newTitleDef && (
  <TitleUnlockToast
    titleName={newTitleDef.name}
    titleIcon={newTitleDef.icon}
    onClose={clearNewTitle}
  />
)}
<PetCompanion />
    </div>
  );
}