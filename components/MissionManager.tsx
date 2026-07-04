'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { Mission } from '@/store/useAppStore';

export default function MissionManager() {
  const missions = useAppStore((state) => state.missions);
  const addMission = useAppStore((state) => state.addMission);
  const updateMission = useAppStore((state) => state.updateMission);
  const deleteMission = useAppStore((state) => state.deleteMission);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form thêm mới
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<'learning' | 'physical'>('learning');
  const [newIcon, setNewIcon] = useState('');

  // Form sửa
  const [editName, setEditName] = useState('');
  const [editGroup, setEditGroup] = useState<'learning' | 'physical'>('learning');
  const [editIcon, setEditIcon] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addMission({
      name: newName,
      group: newGroup,
      icon: newIcon || '📌',
      sortOrder: missions.length + 1,
      isActive: true,
    });
    setNewName('');
    setNewIcon('');
    setShowAddForm(false);
  };

  const startEdit = (mission: Mission) => {
    setEditingId(mission.id);
    setEditName(mission.name);
    setEditGroup(mission.group);
    setEditIcon(mission.icon);
  };

  const handleUpdate = (id: number) => {
    updateMission(id, {
      name: editName,
      group: editGroup,
      icon: editIcon || '📌',
    });
    setEditingId(null);
  };

  const toggleActive = (id: number, current: boolean) => {
    updateMission(id, { isActive: !current });
  };

  const learningMissions = missions.filter(m => m.group === 'learning');
  const physicalMissions = missions.filter(m => m.group === 'physical');

  // Component con hiển thị một card nhiệm vụ (dùng cho cả 2 nhóm)
  const MissionCard = ({ mission }: { mission: Mission }) => {
    const isEditing = editingId === mission.id;
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
        {isEditing ? (
          <div className="flex-1 flex gap-2 items-center flex-wrap">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg"
              placeholder="Tên nhiệm vụ"
            />
            <input
              type="text"
              value={editIcon}
              onChange={(e) => setEditIcon(e.target.value)}
              className="w-20 px-3 py-2 border rounded-lg"
              placeholder="Icon"
            />
            <select
              value={editGroup}
              onChange={(e) => setEditGroup(e.target.value as 'learning' | 'physical')}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="learning">Learning</option>
              <option value="physical">Physical</option>
            </select>
            <button onClick={() => handleUpdate(mission.id)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Lưu</button>
            <button onClick={() => setEditingId(null)} className="px-3 py-2 bg-gray-200 rounded-lg text-sm">Hủy</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mission.icon || '📌'}</span>
              <span className={`font-medium ${!mission.isActive && 'line-through text-gray-400'}`}>
                {mission.name}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(mission.id, mission.isActive)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  mission.isActive
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {mission.isActive ? 'Đang hiện' : 'Đã ẩn'}
              </button>
              <button
                onClick={() => startEdit(mission)}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200"
              >
                Sửa
              </button>
              <button
                onClick={() => deleteMission(mission.id)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200"
              >
                Xóa
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">📋 Quản lý nhiệm vụ</h2>
      <p className="text-gray-500 mb-6">Thêm, sửa, ẩn hoặc xóa nhiệm vụ của bạn.</p>

      {/* Nút thêm mới */}
      <button
        onClick={() => setShowAddForm(true)}
        className="mb-6 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
      >
        + Thêm nhiệm vụ mới
      </button>

      {/* Form thêm mới */}
      {showAddForm && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-lg mb-3">Tạo nhiệm vụ mới</h3>
          <div className="flex gap-4 flex-wrap mb-4">
            <input
              type="text"
              placeholder="Tên nhiệm vụ (vd: Đọc sách)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 min-w-[250px] px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-24 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value as 'learning' | 'physical')}
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="learning">🧠 Learning</option>
              <option value="physical">💪 Physical</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">Thêm</button>
            <button onClick={() => setShowAddForm(false)} className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition">Hủy</button>
          </div>
        </div>
      )}

      {/* Nhóm Learning */}
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>🧠</span> Learning
      </h3>
      <div className="space-y-3 mb-10">
        {learningMissions.length === 0 && (
          <p className="text-gray-400 italic">Chưa có nhiệm vụ nào.</p>
        )}
        {learningMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      {/* Nhóm Physical */}
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>💪</span> Physical
      </h3>
      <div className="space-y-3">
        {physicalMissions.length === 0 && (
          <p className="text-gray-400 italic">Chưa có nhiệm vụ nào.</p>
        )}
        {physicalMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}