'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ProgressCircle() {
  const today = new Date().toISOString().split('T')[0];
  const checkinData = useAppStore((state) => state.checkinHistory[today]);
  const missions = useAppStore((state) => state.missions);

  // 1. Lấy danh sách toàn bộ nhiệm vụ đang active
  const activeMissions = useMemo(
    () => missions.filter((m) => m.isActive),
    [missions]
  );
  const activeMissionCount = activeMissions.length;

  // 2. Tính số nhiệm vụ đã hoàn thành THỰC TẾ
  const completedCount = useMemo(() => {
    if (!checkinData || !checkinData.completedMissionIds) return 0;

    // Dùng Set để loại bỏ các ID bị lưu trùng lặp (nếu có) trong history
    const completedIdsSet = new Set(checkinData.completedMissionIds);

    // Chỉ đếm những nhiệm vụ đang active VÀ có ID nằm trong danh sách đã hoàn thành
    return activeMissions.filter(m => completedIdsSet.has(m.id)).length;
  }, [checkinData, activeMissions]);

  // Nếu chưa điểm danh thì không hiển thị vòng tròn
  if (!checkinData || checkinData.status !== 'completed') {
    return null;
  }

  // 3. Tính toán phần trăm an toàn
  let percentage = activeMissionCount > 0
    ? (completedCount / activeMissionCount) * 100
    : 0;

  // Đảm bảo phần trăm không bao giờ vượt quá 100% trong UI
  if (percentage > 100) percentage = 100;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-44 h-44">
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">
            {Math.round(percentage)}%
          </span>
          <span className="text-sm text-gray-500">
            {completedCount}/{activeMissionCount}
          </span>
        </div>
      </div>
    </div>
  );
}