'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { Reward } from '@/store/useAppStore';

export default function RewardManager() {
  const rewards = useAppStore((state) => state.rewards);
  const addCustomReward = useAppStore((state) => state.addCustomReward);
  const updateReward = useAppStore((state) => state.updateReward);
  const deleteReward = useAppStore((state) => state.deleteReward);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRarity, setNewRarity] = useState<Reward['rarity']>('common');
  const [newProb, setNewProb] = useState(0.1);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editRarity, setEditRarity] = useState<Reward['rarity']>('common');
  const [editProb, setEditProb] = useState(0.1);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCustomReward({ name: newName, rarity: newRarity, probability: newProb });
    setNewName('');
    setShowAdd(false);
  };

  const startEdit = (r: Reward) => {
    setEditingId(r.id);
    setEditName(r.name);
    setEditRarity(r.rarity);
    setEditProb(r.probability);
  };

  const handleUpdate = (id: number) => {
    updateReward(id, { name: editName, rarity: editRarity, probability: editProb });
    setEditingId(null);
  };

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-100 text-gray-800',
    normal: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    rare: 'bg-purple-100 text-purple-800',
    super_rare: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">🎁 Quản lý phần thưởng</h2>
      <button
        onClick={() => setShowAdd(true)}
        className="mb-6 px-5 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
      >
        + Thêm phần thưởng mới
      </button>

      {showAdd && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border">
          <h3 className="font-semibold text-lg mb-3">Tạo phần thưởng</h3>
          <div className="flex gap-4 flex-wrap mb-4">
            <input placeholder="Tên" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 min-w-[200px] px-4 py-2 border rounded-xl" />
            <select value={newRarity} onChange={(e) => setNewRarity(e.target.value as any)} className="px-4 py-2 border rounded-xl">
              <option value="common">Common</option>
              <option value="normal">Normal</option>
              <option value="good">Good</option>
              <option value="rare">Rare</option>
              <option value="super_rare">Super Rare</option>
            </select>
            <input type="number" step="0.01" min="0" max="1" value={newProb} onChange={(e) => setNewProb(parseFloat(e.target.value))} className="w-24 px-4 py-2 border rounded-xl" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-5 py-2 bg-green-600 text-white rounded-xl">Thêm</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 bg-gray-200 rounded-xl">Hủy</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rewards.map((reward) => (
          <div key={reward.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
            {editingId === reward.id ? (
              <div className="flex-1 flex gap-2 items-center flex-wrap">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg" />
                <select value={editRarity} onChange={(e) => setEditRarity(e.target.value as any)} className="px-3 py-2 border rounded-lg">
                  <option value="common">Common</option>
                  <option value="normal">Normal</option>
                  <option value="good">Good</option>
                  <option value="rare">Rare</option>
                  <option value="super_rare">Super Rare</option>
                </select>
                <input type="number" step="0.01" value={editProb} onChange={(e) => setEditProb(parseFloat(e.target.value))} className="w-24 px-3 py-2 border rounded-lg" />
                <button onClick={() => handleUpdate(reward.id)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Lưu</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-2 bg-gray-200 rounded-lg text-sm">Hủy</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <span className="font-medium">{reward.name}</span>
                    <span className={`ml-3 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${rarityColors[reward.rarity]}`}>
                      {reward.rarity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Xác suất: {(reward.probability * 100).toFixed(1)}%</span>
                  <button onClick={() => startEdit(reward)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">Sửa</button>
                  <button onClick={() => deleteReward(reward.id)} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm">Xóa</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}