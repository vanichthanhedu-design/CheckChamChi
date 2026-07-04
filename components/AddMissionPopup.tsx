'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  group: 'learning' | 'physical';
  onClose: () => void;
}

export default function AddMissionPopup({ group, onClose }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const addMission = useAppStore((s) => s.addMission);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMission({
      name: name.trim(),
      icon: icon.trim() || '📌',
      group,
      sortOrder: 0, // sẽ được xử lý sau nếu cần
      isActive: true,
    });
    setName('');
    setIcon('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">
          Thêm nhiệm vụ {group === 'learning' ? '📚 Learning' : '💪 Physical'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Tên nhiệm vụ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          <input
            type="text"
            placeholder="Icon (emoji) - tùy chọn"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}