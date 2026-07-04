import type { AchievementDef, AppState } from '@/store/useAppStore';

export const ACHIEVEMENT_LIST: AchievementDef[] = [
  {
    id: 'streak_7',
    name: 'Khởi đầu kiên trì',
    description: 'Đạt streak 7 ngày',
    icon: '🔥',
    condition: (state) => state.streaks.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Thói quen vàng',
    description: 'Đạt streak 30 ngày',
    icon: '⭐',
    condition: (state) => state.streaks.currentStreak >= 30,
  },
  {
    id: 'streak_50',
    name: 'Bền bỉ phi thường',
    description: 'Đạt streak 50 ngày',
    icon: '💎',
    condition: (state) => state.streaks.currentStreak >= 50,
  },
  {
    id: 'streak_100',
    name: 'Huyền thoại',
    description: 'Đạt streak 100 ngày',
    icon: '👑',
    condition: (state) => state.streaks.currentStreak >= 100,
  },
  {
    id: 'total_30',
    name: 'Chiến binh 30 ngày',
    description: 'Tổng 30 ngày điểm danh',
    icon: '📅',
    condition: (state) => {
      const completed = Object.values(state.checkinHistory).filter(
        (d) => d.status === 'completed'
      ).length;
      return completed >= 30;
    },
  },
  {
    id: 'total_100',
    name: 'Hành trình 100 ngày',
    description: 'Tổng 100 ngày điểm danh',
    icon: '🛡️',
    condition: (state) => {
      const completed = Object.values(state.checkinHistory).filter(
        (d) => d.status === 'completed'
      ).length;
      return completed >= 100;
    },
  },
];