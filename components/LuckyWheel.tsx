'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  targetRewardId: number;
  onSpinEnd?: () => void;
}

export default function LuckyWheel({ targetRewardId, onSpinEnd }: Props) {
  const rewards = useAppStore((state) => state.rewards);
  const [spinning, setSpinning] = useState(true); // tự động quay khi mount
  const [result, setResult] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const n = rewards.length;
  if (n === 0) return <p>Không có phần thưởng.</p>;

  const anglePerSlice = 360 / n;
  const targetIndex = rewards.findIndex(r => r.id === targetRewardId);
  const targetAngle = targetIndex !== -1 
    ? 360 - (targetIndex * anglePerSlice + anglePerSlice / 2) 
    : 0;
  const totalAngle = 360 * 5 + targetAngle;

  useEffect(() => {
    // Bắt đầu quay ngay khi component mount
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wheelRef.current.style.transform = `rotate(${totalAngle}deg)`;
    }
    const timer = setTimeout(() => {
      const reward = rewards[targetIndex];
      if (reward) setResult(reward.name);
      setSpinning(false);
      if (onSpinEnd) onSpinEnd();
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4'];

  return (
    <div className="flex flex-col items-center p-6">
      <h3 className="text-2xl font-bold mb-4">🎡 Vòng quay may mắn</h3>
      <div className="relative w-80 h-80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 text-3xl">▼</div>
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-gray-300 overflow-hidden"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {rewards.map((reward, idx) => {
              const startAngle = (idx * anglePerSlice * Math.PI) / 180;
              const endAngle = ((idx + 1) * anglePerSlice * Math.PI) / 180;
              const x1 = 50 + 45 * Math.cos(startAngle);
              const y1 = 50 + 45 * Math.sin(startAngle);
              const x2 = 50 + 45 * Math.cos(endAngle);
              const y2 = 50 + 45 * Math.sin(endAngle);
              const largeArc = anglePerSlice > 180 ? 1 : 0;
              const pathData = `M50,50 L${x1},${y1} A45,45 0 ${largeArc},1 ${x2},${y2} Z`;
              const color = colors[idx % colors.length];
              return (
                <g key={idx}>
                  <path d={pathData} fill={color} stroke="white" strokeWidth="0.2" />
                  <text
                    x={50 + 30 * Math.cos((startAngle + endAngle) / 2)}
                    y={50 + 30 * Math.sin((startAngle + endAngle) / 2)}
                    fontSize="2.5"
                    fill="white"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${(idx * anglePerSlice + anglePerSlice / 2)}, ${50 + 30 * Math.cos((startAngle + endAngle) / 2)}, ${50 + 30 * Math.sin((startAngle + endAngle) / 2)})`}
                  >
                    {reward.name.length > 10 ? reward.name.slice(0, 10) + '...' : reward.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded-xl text-center animate-bounce">
          <p className="text-lg font-semibold text-green-800">🎉 Bạn nhận được:</p>
          <p className="text-2xl font-bold">{result}</p>
        </div>
      )}
    </div>
  );
}