'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const checkinHistory = useAppStore((state) => state.checkinHistory);
  const streaks = useAppStore((state) => state.streaks);

  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const daysArray = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      daysArray.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        dateString: formatDateString(year, month - 1, day),
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
        dateString: formatDateString(year, month, d),
      });
    }

    const totalDays = daysArray.length;
    const remainingDays = 7 - (totalDays % 7);
    if (remainingDays < 7) {
      for (let d = 1; d <= remainingDays; d++) {
        daysArray.push({
          date: new Date(year, month + 1, d),
          isCurrentMonth: false,
          dateString: formatDateString(year, month + 1, d),
        });
      }
    }

    return daysArray;
  };

  const formatDateString = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const getDayStatus = (dateString: string) => {
    const day = checkinHistory[dateString];
    if (!day) return null;
    return day.status;
  };

  const isDayInStreak = (dateString: string) => {
    if (streaks.currentStreak === 0) return false;
    const today = new Date();
    const checkDate = new Date(dateString);
    const diffTime = today.getTime() - checkDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (
      checkinHistory[dateString]?.status === 'completed' &&
      diffDays >= 0 &&
      diffDays < streaks.currentStreak
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const totalCompletedDays = Object.values(checkinHistory).filter(
    (day) => day.status === 'completed'
  ).length;

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const days = getCalendarDays();

  return (
    <div className="p-8 max-w-7xl mx-auto flex gap-8">
      {/* Cột trái: Thống kê */}
      <div className="w-64 flex flex-col space-y-6 pt-16">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500 mb-1">🔥 Streak hiện tại</p>
          <p className="text-4xl font-bold text-orange-500">{streaks.currentStreak} <span className="text-lg">ngày</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500 mb-1">🏆 Streak dài nhất</p>
          <p className="text-4xl font-bold text-purple-600">{streaks.longestStreak} <span className="text-lg">ngày</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500 mb-1">📅 Tổng ngày điểm danh</p>
          <p className="text-4xl font-bold text-green-600">{totalCompletedDays}</p>
        </div>
      </div>

      {/* Cột phải: Lịch */}
      <div className="flex-1">
        {/* Header điều hướng */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-3 rounded-xl bg-white hover:bg-gray-100 shadow-md text-2xl font-bold transition"
          >
            ←
          </button>
          <h2 className="text-3xl font-extrabold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-3 rounded-xl bg-white hover:bg-gray-100 shadow-md text-2xl font-bold transition"
          >
            →
          </button>
        </div>

        {/* Lưới lịch */}
        <div className="grid grid-cols-7 gap-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
            <div key={idx} className="text-center text-sm font-bold text-gray-500 py-2">
              {day}
            </div>
          ))}

          {days.map((dayObj, index) => {
            const status = getDayStatus(dayObj.dateString);
            const isStreakDay = isDayInStreak(dayObj.dateString);
            const isToday =
              new Date().toISOString().split('T')[0] === dayObj.dateString;

            let bgColor = 'bg-white';
            if (status === 'completed') bgColor = 'bg-green-50';
            else if (status === 'missed') bgColor = 'bg-red-50';
            else if (status === 'shielded') bgColor = 'bg-yellow-50';
            if (!dayObj.isCurrentMonth) bgColor = 'bg-gray-50';

            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border-4 transition-all duration-200 ${
                  isToday
                    ? 'border-blue-500 shadow-lg scale-105'
                    : 'border-transparent'
                } ${isStreakDay ? 'ring-2 ring-orange-400 ring-offset-1' : ''} ${
                  dayObj.isCurrentMonth ? bgColor : 'bg-gray-50 opacity-50'
                }`}
              >
                <span className={`text-lg font-semibold ${
                  !dayObj.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  {dayObj.date.getDate()}
                </span>

                {status === 'completed' && (
                  <span className="text-2xl leading-none mt-1">🔥</span>
                )}
                {status === 'missed' && (
                  <span className="text-xs mt-1">❌</span>
                )}
                {status === 'shielded' && (
                  <span className="text-xs mt-1">🛡️</span>
                )}
                {!status && isStreakDay && (
                  <span className="text-2xl leading-none mt-1">🔥</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}