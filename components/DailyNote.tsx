'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function DailyNote() {
  const today = new Date().toISOString().split('T')[0];
  const checkinData = useAppStore((state) => state.checkinHistory[today]);
  const updateJournal = useAppStore((state) => state.updateJournal);

  const [note, setNote] = useState(checkinData?.evidenceNote || '');

  useEffect(() => {
    setNote(checkinData?.evidenceNote || '');
  }, [checkinData?.evidenceNote]);

  const handleSave = () => {
    updateJournal(today, { note });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">📝 Ghi chú hôm nay</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nhập suy nghĩ, cảm nhận, hoặc bất cứ điều gì bạn muốn ghi lại..."
        className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
      />
      <button
        onClick={handleSave}
        className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Lưu ghi chú
      </button>
    </div>
  );
}