'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const moodOptions = [
  {
    id: 'stress',
    emoji: '😫',
    label: 'Stress',
    color: 'bg-red-100 hover:bg-red-200 border-red-300',
    advices: [
      'Chậm lại một chút cũng không sao.',
      'Bạn đã cố gắng rất nhiều rồi.',
      'Mình luôn tin bạn sẽ vượt qua.',
    ],
  },
  {
    id: 'negative',
    emoji: '😔',
    label: 'Tiêu Cực',
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    advices: [
      'Đừng quá khắt khe với bản thân.',
      'Ngày mai luôn là một khởi đầu mới.',
      'Một bước nhỏ hôm nay vẫn là tiến bộ.',
    ],
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Bình Thường',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    advices: [
      'Chúc bạn một ngày thật nhẹ nhàng.',
      'Cứ duy trì nhịp độ của riêng mình.',
      'Mỗi ngày đều đáng để cố gắng.',
    ],
  },
  {
    id: 'happy',
    emoji: '😊',
    label: 'Vui',
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
    advices: [
      'Thật vui khi thấy bạn mỉm cười!',
      'Mang nguồn năng lượng này đi thật xa nhé.',
      'Tiếp tục phát huy nào!',
    ],
  },
  {
    id: 'blissful',
    emoji: '😄',
    label: 'Hạnh Phúc',
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    advices: [
      'Hạnh phúc rất hợp với bạn!',
      'Hôm nay thật đáng để ghi nhớ.',
      'Hy vọng niềm vui sẽ theo bạn cả ngày.',
    ],
  },
];

export default function MoodSelector() {
  const today = new Date().toISOString().split('T')[0];
  const checkinData = useAppStore((state) => state.checkinHistory[today]);
  const updateJournal = useAppStore((state) => state.updateJournal);

  const [selectedMood, setSelectedMood] = useState<string | null>(
    checkinData?.mood || null
  );
  const [advice, setAdvice] = useState<string | null>(
    checkinData?.moodAdvice || null
  );

  const handleMoodSelect = (moodId: string) => {
    if (selectedMood === moodId) return;

    const mood = moodOptions.find(m => m.id === moodId);
    if (!mood) return;

    const randomAdvice = mood.advices[Math.floor(Math.random() * mood.advices.length)];

    setSelectedMood(moodId);
    setAdvice(randomAdvice);

    updateJournal(today, { mood: moodId as any, moodAdvice: randomAdvice });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">😌 Hôm nay tâm trạng bạn thế nào?</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedMood === mood.id
                ? `${mood.color} scale-105 shadow-md border-current`
                : 'bg-gray-50 border-gray-200 hover:shadow-sm'
            }`}
          >
            <span className="text-4xl mb-2">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
      {advice && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
          <p className="text-lg font-medium text-gray-700">💬 Lời khuyên cho bạn:</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">{advice}</p>
        </div>
      )}
    </div>
  );
}