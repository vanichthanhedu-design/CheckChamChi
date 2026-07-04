'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import InfoCard from './InfoCard';

export default function StatisticsView() {
  const checkinHistory = useAppStore((state) => state.checkinHistory);
  const streaks = useAppStore((state) => state.streaks);
  const profile = useAppStore((state) => state.profile);
  const rewardHistory = useAppStore((state) => state.rewardHistory);
  const rewards = useAppStore((state) => state.rewards);
  const missions = useAppStore((state) => state.missions);

  // Tính tổng số ngày đã điểm danh (không bị ảnh hưởng bởi biểu đồ 7 ngày)
  const totalDays = Object.values(checkinHistory).filter(
    (d) => d.status === 'completed'
  ).length;

  // Dữ liệu 7 ngày gần nhất (Tự động cập nhật và loại bỏ ngày cũ)
  const last7DaysData = useMemo(() => {
    const activeMissions = missions.filter((m) => m.isActive);
    const activeMissionCount = activeMissions.length;
    
    const days = [];
    // Vòng lặp chạy lùi 6 ngày về trước cho đến hôm nay (i=0)
    // Ngày cũ hơn 7 ngày sẽ không bao giờ được lặp tới -> Tự động bị ẩn khỏi UI
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const data = checkinHistory[dateStr];
      
      let completedCount = 0;
      if (data && data.completedMissionIds) {
        const completedIdsSet = new Set(data.completedMissionIds);
        completedCount = activeMissions.filter(m => completedIdsSet.has(m.id)).length;
      }

      let percentage = activeMissionCount > 0 
        ? (completedCount / activeMissionCount) * 100 
        : 0;
        
      if (percentage > 100) percentage = 100;

      days.push({
        date: d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' }),
        percentage: Math.round(percentage),
      });
    }
    return days;
  }, [checkinHistory, missions]);

  // Thống kê số lần nhận thưởng
  const rewardStats = useMemo(() => {
    const counts: Record<string, number> = {};
    rewardHistory.forEach((entry) => {
      const reward = rewards.find((r) => r.id === entry.rewardId);
      const name = reward?.name || 'Khác';
      counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [rewardHistory, rewards]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📊 Thống kê</h1>

      {/* Hàng tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon="📅" label="Tổng ngày điểm danh" value={`${totalDays}`} />
        <InfoCard icon="🔥" label="Streak hiện tại" value={`${streaks.currentStreak} ngày`} />
        <InfoCard icon="🏆" label="Streak dài nhất" value={`${streaks.longestStreak} ngày`} />
        <InfoCard icon="🪙" label="Tổng coin" value={`${profile.coins}`} />
      </div>

      {/* Biểu đồ 7 ngày */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-semibold mb-6">📈 Tỉ lệ hoàn thành 7 ngày qua</h3>
        <div className="flex items-end justify-around h-48">
          {last7DaysData.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 w-12">
              <span className="text-sm font-bold text-gray-700">{day.percentage}%</span>
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300"
                style={{ height: `${(day.percentage / 100) * 150}px` }}
              />
              <span className="text-xs text-gray-500">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Thống kê phần thưởng */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-semibold mb-4">🎁 Số lần nhận thưởng</h3>
        {Object.keys(rewardStats).length === 0 ? (
          <p className="text-gray-400">Chưa có dữ liệu.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(rewardStats).map(([name, count]) => (
              <div
                key={name}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border"
              >
                <span className="font-medium">{name}</span>
                <span className="text-lg font-bold text-gray-700">{count} lần</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}