import MoodCardSmall from '@/components/MoodCardSmall';
import MiniCalendar from '@/components/MiniCalendar';
import DailyPlanner from '@/components/DailyPlanner';
import QuickNote from '@/components/QuickNote';
import GoalsCard from '@/components/GoalsCard';

export default function TodosPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">📋 TODOS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Cột trái: Tâm trạng, Lịch mini, Mục tiêu (Vision Board) */}
        <div className="space-y-4">
          <MoodCardSmall />
          <MiniCalendar />
          <GoalsCard />
        </div>

        {/* Cột phải: Kế hoạch + Ghi chú */}
        <div className="lg:col-span-3 space-y-6">
          <DailyPlanner />
          <QuickNote />
        </div>
      </div>
    </div>
  );
}