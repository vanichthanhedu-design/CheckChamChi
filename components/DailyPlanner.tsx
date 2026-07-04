'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function DailyPlanner() {
  const today = new Date().toISOString().split('T')[0];
  const getOrCreateDailyPlan = useAppStore((s) => s.getOrCreateDailyPlan);
  const updateTimeSlot = useAppStore((s) => s.updateTimeSlot);
  const addTimeSlot = useAppStore((s) => s.addTimeSlot);
  const removeTimeSlot = useAppStore((s) => s.removeTimeSlot);
  const dailyPlan = useAppStore((s) => s.todos.dailyPlans[today]);

  const plan = dailyPlan || getOrCreateDailyPlan(today); // đảm bảo có plan

  const morningSlots = plan.timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 7 && hour < 12;
  });
  const afternoonSlots = plan.timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 13 && hour < 19;
  });

  const handleTaskChange = (index: number, value: string) => {
    updateTimeSlot(today, index, { task: value });
  };

  const handleToggle = (index: number) => {
    const slot = plan.timeSlots[index];
    updateTimeSlot(today, index, { completed: !slot.completed });
  };

  const handleAddSlot = (hour: string) => {
    addTimeSlot(today, { time: hour, task: '', completed: false });
  };

  const handleRemoveSlot = (index: number) => {
    removeTimeSlot(today, index);
  };

  // Hàm mở prompt để nhập giờ tùy chỉnh
  const promptCustomTime = (defaultHour: string, isMorning: boolean) => {
    const input = window.prompt(
      `Nhập giờ (định dạng HH:MM, ví dụ: ${defaultHour}):`,
      defaultHour
    );
    if (!input) return; // Hủy

    // Kiểm tra định dạng HH:MM
    const parts = input.split(':');
    if (parts.length !== 2) {
      alert('Định dạng không hợp lệ. Vui lòng nhập dạng HH:MM.');
      return;
    }
    const hour = parseInt(parts[0]);
    if (isNaN(hour)) {
      alert('Giờ không hợp lệ.');
      return;
    }

    // (Tùy chọn) Có thể giới hạn giờ trong khoảng buổi tương ứng
    if (isMorning && (hour < 7 || hour >= 12)) {
      alert('Buổi sáng chỉ nhận giờ từ 07:00 đến 11:59.');
      return;
    }
    if (!isMorning && (hour < 13 || hour >= 19)) {
      alert('Buổi chiều chỉ nhận giờ từ 13:00 đến 18:59.');
      return;
    }

    // Đảm bảo định dạng HH:MM có 2 chữ số
    const formatted = `${hour.toString().padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    handleAddSlot(formatted);
  };

  // Component con hiển thị một nhóm giờ (buổi)
  const TimeSlotList = ({ slots, startIndexOffset, title, defaultHour, isMorning }: any) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-500 mb-2">{title}</h4>
      {slots.map((slot: any, idx: number) => {
        const globalIndex = startIndexOffset + idx;
        return (
          <div key={globalIndex} className="flex items-center gap-2">
            <span className="w-12 text-sm text-gray-500">{slot.time}</span>
            <input
              type="text"
              value={slot.task}
              onChange={(e) => handleTaskChange(globalIndex, e.target.value)}
              className={`flex-1 px-2 py-1 rounded-lg border text-sm ${
                slot.completed ? 'bg-green-50 line-through text-gray-500' : 'bg-white'
              }`}
              placeholder="Thêm công việc..."
            />
            <button
              onClick={() => handleToggle(globalIndex)}
              className={`text-sm ${slot.completed ? 'text-green-600' : 'text-gray-400'}`}
            >
              ✓
            </button>
            <button
              onClick={() => handleRemoveSlot(globalIndex)}
              className="text-sm text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        );
      })}
      <button
        onClick={() => promptCustomTime(defaultHour, isMorning)}
        className="text-xs text-blue-500 hover:underline"
      >
        + Thêm giờ
      </button>
    </div>
  );

  const morningStartIndex = 0;
  const afternoonStartIndex = morningSlots.length;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="text-lg font-bold mb-4">📅 Kế hoạch hôm nay</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeSlotList
          slots={morningSlots}
          startIndexOffset={morningStartIndex}
          title="☀️ Buổi sáng"
          defaultHour="08:00"
          isMorning={true}
        />
        <TimeSlotList
          slots={afternoonSlots}
          startIndexOffset={afternoonStartIndex}
          title="🌙 Buổi chiều"
          defaultHour="14:00"
          isMorning={false}
        />
      </div>
    </div>
  );
}