'use client';
import { useState } from 'react';

export default function MiniCalendar() {
  const [currentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0: CN

  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-white rounded-2xl shadow-md p-3">
      <div className="text-sm font-semibold text-center mb-2">
        Tháng {month + 1} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekdays.map((d, i) => (
          <div key={i} className="font-medium text-gray-400">{d}</div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            className={`py-1 rounded-full ${
              d === today ? 'bg-blue-500 text-white font-bold' : 'text-gray-600'
            }`}
          >
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  );
}