'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import WheelModal from './WheelModal';

export default function MissionList() {
  const today = new Date().toISOString().split('T')[0];
  const checkinData = useAppStore((state) => state.checkinHistory[today]);
  const missions = useAppStore((state) => state.missions);
  const toggleMission = useAppStore((state) => state.toggleMission);
  const spinWheel = useAppStore((state) => state.spinWheel);

  const [showWheel, setShowWheel] = useState(false);
  const [lastRewardId, setLastRewardId] = useState<number | null>(null);

  const isCheckedIn = checkinData?.status === 'completed';
  const activeMissions = missions.filter(m => m.isActive);

  const handleToggle = (missionId: number) => {
    // Nếu chưa điểm danh thì không làm gì
    if (!isCheckedIn) return;

    const isCurrentlyCompleted = checkinData.completedMissionIds.includes(missionId);
    if (!isCurrentlyCompleted) {
      toggleMission(missionId);
      const won = spinWheel();
      if (won) {
        setLastRewardId(won.id);
        setShowWheel(true);
      }
    } else {
      toggleMission(missionId);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-700">📋 Nhiệm vụ hôm nay</h3>
          {!isCheckedIn && (
            <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              🔒 Hãy điểm danh để mở khóa
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeMissions.map((mission) => {
            const isDone = checkinData?.completedMissionIds.includes(mission.id);
            return (
              <button
                key={mission.id}
                onClick={() => handleToggle(mission.id)}
                disabled={!isCheckedIn}
                className={`flex items-center p-3 rounded-xl border transition-all duration-200 ${
                  !isCheckedIn
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : isDone
                    ? 'bg-green-50 border-green-300 line-through text-gray-500'
                    : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-300'
                }`}
              >
                <span className="text-2xl mr-3">{mission.icon}</span>
                <span className="font-medium">{mission.name}</span>
                {isDone && <span className="ml-auto text-green-500">✓</span>}
                {!isCheckedIn && <span className="ml-auto text-gray-400 text-sm">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal vòng quay */}
      {showWheel && lastRewardId !== null && (
        <WheelModal
          isOpen={showWheel}
          onClose={() => setShowWheel(false)}
          targetRewardId={lastRewardId}
        />
      )}
    </>
  );
}