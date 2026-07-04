'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import GoalsPopup from './GoalsPopup';

export default function GoalsCard() {
  const goals = useAppStore((s) => s.todos.goals);
  const incompleteGoals = goals.filter(g => !g.completed).slice(0, 3);
  const completedCount = goals.filter(g => g.completed).length;
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
        onClick={() => setShowPopup(true)}
      >
        <h3 className="text-base font-bold mb-2">🎯 Mục tiêu của tôi</h3>
        <div className="space-y-1">
          {incompleteGoals.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có mục tiêu</p>
          ) : (
            <ul className="list-disc list-inside space-y-0.5">
              {incompleteGoals.map(g => (
                <li key={g.id} className="text-sm text-gray-700">{g.title}</li>
              ))}
              {goals.filter(g => !g.completed).length > 3 && (
                <li className="text-xs text-gray-400">... xem thêm</li>
              )}
            </ul>
          )}
        </div>
        {completedCount > 0 && (
          <p className="text-xs text-green-600 mt-2 font-medium">
            ✅ {completedCount} đã hoàn thành
          </p>
        )}
      </div>
      {showPopup && <GoalsPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}