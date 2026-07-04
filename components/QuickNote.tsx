'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function QuickNote() {
  const quickNote = useAppStore((s) => s.todos.quickNote);
  const setQuickNote = useAppStore((s) => s.setQuickNote);
  const [note, setNote] = useState(quickNote);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuickNote(note);
    }, 500);
    return () => clearTimeout(timer);
  }, [note, setQuickNote]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="text-lg font-bold mb-2">📝 Ghi chú nhanh</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full h-32 p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Viết ghi chú, ý tưởng..."
      />
    </div>
  );
}