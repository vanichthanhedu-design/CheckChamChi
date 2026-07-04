'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

interface Props {
  onClose: () => void;
}

export default function GoalsPopup({ onClose }: Props) {
  const goals = useAppStore((s) => s.todos.goals);
  const addGoal = useAppStore((s) => s.addGoal);
  const toggleGoal = useAppStore((s) => s.toggleGoal);
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (newTitle.trim()) {
      addGoal(newTitle.trim());
      setNewTitle('');
    }
  };

  const incompleteGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🎯 Quản lý mục tiêu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
        </div>

        {/* Thêm mới */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nhập mục tiêu mới..."
            className="flex-1 px-4 py-2 border rounded-xl"
          />
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Thêm
          </button>
        </div>

        {/* Chưa hoàn thành */}
        <h3 className="font-semibold text-gray-700 mb-2">📌 Chưa hoàn thành</h3>
        <div className="space-y-2 mb-6">
          {incompleteGoals.length === 0 && <p className="text-sm text-gray-400">Không có.</p>}
          {incompleteGoals.map(goal => (
            <div key={goal.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <button onClick={() => toggleGoal(goal.id)} className="text-green-500 hover:text-green-700">
                ✓
              </button>
              <span className="flex-1">{goal.title}</span>
              <button onClick={() => deleteGoal(goal.id)} className="text-red-400 hover:text-red-600">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Đã hoàn thành */}
        <h3 className="font-semibold text-gray-700 mb-2">✅ Đã hoàn thành</h3>
        <div className="space-y-2">
          {completedGoals.length === 0 && <p className="text-sm text-gray-400">Chưa có.</p>}
          {completedGoals.map(goal => (
            <div key={goal.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg line-through">
              <button onClick={() => toggleGoal(goal.id)} className="text-gray-500 hover:text-gray-700">
                ↩️
              </button>
              <span className="flex-1 text-gray-500">{goal.title}</span>
              <button onClick={() => deleteGoal(goal.id)} className="text-red-400 hover:text-red-600">
                ✕
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}