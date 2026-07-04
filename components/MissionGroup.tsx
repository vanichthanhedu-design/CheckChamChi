'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import WheelModal from './WheelModal';
import AddMissionPopup from './AddMissionPopup';
import type { Mission } from '@/store/useAppStore';

interface Props {
  group: 'learning' | 'physical';
}

export default function MissionGroup({ group }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const checkinData = useAppStore((s) => s.checkinHistory[today]);
  const missions = useAppStore((s) => s.missions);
  const toggleMission = useAppStore((s) => s.toggleMission);
  const spinWheel = useAppStore((s) => s.spinWheel);
  const updateMission = useAppStore((s) => s.updateMission);
  const deleteMission = useAppStore((s) => s.deleteMission);

  const [showAdd, setShowAdd] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [lastRewardId, setLastRewardId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const isCheckedIn = checkinData?.status === 'completed';

  // Lọc nhiệm vụ active thuộc nhóm
  const groupMissions = useMemo(
    () => missions.filter((m) => m.group === group && m.isActive),
    [missions, group]
  );

  const completedIds = checkinData?.completedMissionIds || [];
  const completedCount = groupMissions.filter((m) => completedIds.includes(m.id)).length;
  const totalCount = groupMissions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Xử lý khi toggle nhiệm vụ
  const handleToggle = (missionId: number) => {
    if (!isCheckedIn) return;
    const isCurrentlyCompleted = completedIds.includes(missionId);
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

  // Sửa nhiệm vụ
  const startEdit = (m: Mission) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditIcon(m.icon);
  };

  const handleUpdate = (id: number) => {
    updateMission(id, { name: editName, icon: editIcon || '📌' });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Xóa nhiệm vụ này?')) deleteMission(id);
  };

  const title = group === 'learning' ? '📚 Learning' : '💪 Physical';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-lg"
            title="Thêm nhiệm vụ"
          >
            ➕
          </button>
          {/* Menu mở rộng ⋮ (tạm thời để trống) */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition text-lg"
            title="Tùy chọn"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Task Summary */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Tiến độ hôm nay</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {completedCount} / {totalCount} nhiệm vụ hoàn thành
        </p>
      </div>

      {/* Danh sách nhiệm vụ */}
      <div className="space-y-2 flex-1">
        {groupMissions.length === 0 && (
          <p className="text-gray-400 text-sm italic">Chưa có nhiệm vụ nào.</p>
        )}
        {groupMissions.map((mission) => {
          const isDone = completedIds.includes(mission.id);
          const isEditing = editingId === mission.id;

          return (
            <div
              key={mission.id}
              className={`flex items-center justify-between p-2 rounded-lg border ${
                isDone ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
              }`}
            >
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    placeholder="Tên"
                  />
                  <input
                    type="text"
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    className="w-16 px-2 py-1 border rounded text-sm"
                    placeholder="Icon"
                  />
                  <button onClick={() => handleUpdate(mission.id)} className="text-green-600 hover:text-green-800 text-sm px-1">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 text-sm px-1">✕</button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleToggle(mission.id)}
                    disabled={!isCheckedIn}
                    className={`flex items-center gap-2 flex-1 text-left ${
                      !isCheckedIn ? 'cursor-not-allowed opacity-60' : ''
                    }`}
                  >
                    <span className="text-xl">{mission.icon || '📌'}</span>
                    <span className={`font-medium text-sm ${isDone ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {mission.name}
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
                    {isDone && <span className="text-green-500 text-sm">✓</span>}
                    <button
                      onClick={() => startEdit(mission)}
                      className="p-1 text-xs text-gray-400 hover:text-yellow-600 transition"
                      title="Sửa"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(mission.id)}
                      className="p-1 text-xs text-gray-400 hover:text-red-600 transition"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Popup thêm mới */}
      {showAdd && (
        <AddMissionPopup group={group} onClose={() => setShowAdd(false)} />
      )}

      {/* Modal vòng quay */}
      {showWheel && lastRewardId !== null && (
        <WheelModal
          isOpen={showWheel}
          onClose={() => setShowWheel(false)}
          targetRewardId={lastRewardId}
        />
      )}
    </div>
  );
}