import { SHOP_TITLES } from './shopItems';
import { GACHA_TITLES } from './gachaItems';
import type { AppState } from '@/store/useAppStore';

export interface TitleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  condition: (state: AppState) => boolean;
  progress: (state: AppState) => { current: number; target: number } | null;
}

// Helper: tính số ngày liên tiếp có earnedCoin (hoàn thành 100%)
const getComboStreak = (state: AppState): number => {
  let count = 0;
  const d = new Date();
  const todayStr = d.toISOString().split('T')[0];
  if (!state.checkinHistory[todayStr] || state.checkinHistory[todayStr].status !== 'completed') {
    d.setDate(d.getDate() - 1);
  }
  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    const day = state.checkinHistory[dateStr];
    if (day && day.status === 'completed' && day.earnedCoin) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
};

export const TITLE_LIST: TitleDefinition[] = [
  // ========== NHÓM STREAK ==========
  {
    id: 'streak_3',
    name: 'Mầm Non Chăm Chỉ',
    description: 'Duy trì streak 3 ngày',
    icon: '🌱',
    category: 'Chuỗi học tập',
    condition: (state) => state.streaks.currentStreak >= 3,
    progress: (state) => ({
      current: Math.min(state.streaks.currentStreak, 3),
      target: 3,
    }),
  },
  {
    id: 'streak_7',
    name: 'Chiến Thần Giữ Lửa',
    description: 'Streak 7 ngày liên tục',
    icon: '🔥',
    category: 'Chuỗi học tập',
    condition: (state) => state.streaks.currentStreak >= 7,
    progress: (state) => ({
      current: Math.min(state.streaks.currentStreak, 7),
      target: 7,
    }),
  },
  {
    id: 'streak_14',
    name: 'Cú Đêm Miệt Mài',
    description: 'Streak 14 ngày',
    icon: '🦉',
    category: 'Chuỗi học tập',
    condition: (state) => state.streaks.currentStreak >= 14,
    progress: (state) => ({
      current: Math.min(state.streaks.currentStreak, 14),
      target: 14,
    }),
  },
  {
    id: 'streak_30',
    name: 'Kẻ Hủy Diệt Lười Biếng',
    description: 'Streak 30 ngày',
    icon: '👑',
    category: 'Chuỗi học tập',
    condition: (state) => state.streaks.currentStreak >= 30,
    progress: (state) => ({
      current: Math.min(state.streaks.currentStreak, 30),
      target: 30,
    }),
  },
  {
    id: 'streak_60',
    name: 'Khủng Long Bất Tử',
    description: 'Streak 60 ngày trở lên',
    icon: '🦖',
    category: 'Chuỗi học tập',
    condition: (state) => state.streaks.currentStreak >= 60,
    progress: (state) => ({
      current: Math.min(state.streaks.currentStreak, 60),
      target: 60,
    }),
  },

  // ========== NHÓM COMBO (Điểm danh + 100%) ==========
  {
    id: 'combo_3',
    name: 'Săn Mục tiêu Xuyên Lục Địa',
    description: '3 ngày liên tiếp điểm danh & hoàn thành 100%',
    icon: '🐾',
    category: 'Hoàn thành xuất sắc',
    condition: (state) => getComboStreak(state) >= 3,
    progress: (state) => ({
      current: Math.min(getComboStreak(state), 3),
      target: 3,
    }),
  },
  {
    id: 'combo_7',
    name: 'Giáo Chủ Toàn Diện',
    description: '7 ngày liên tiếp hoàn hảo',
    icon: '💯',
    category: 'Hoàn thành xuất sắc',
    condition: (state) => getComboStreak(state) >= 7,
    progress: (state) => ({
      current: Math.min(getComboStreak(state), 7),
      target: 7,
    }),
  },
  {
    id: 'combo_14',
    name: 'Học Giả Vũ Trụ',
    description: '14 ngày liên tiếp quét sạch nhiệm vụ',
    icon: '🛸',
    category: 'Hoàn thành xuất sắc',
    condition: (state) => getComboStreak(state) >= 14,
    progress: (state) => ({
      current: Math.min(getComboStreak(state), 14),
      target: 14,
    }),
  },
  {
    id: 'combo_30',
    name: 'Chúa Tể Hủy Diệt Trì Hoãn',
    description: '30 ngày liên tiếp hoàn hảo',
    icon: '💥',
    category: 'Hoàn thành xuất sắc',
    condition: (state) => getComboStreak(state) >= 30,
    progress: (state) => ({
      current: Math.min(getComboStreak(state), 30),
      target: 30,
    }),
  },
  
  // ========== NHÓM ĐẶC BIỆT ==========
  {
    id: 'beginner',
    name: 'Tân Thủ',
    description: 'Chào mừng bạn đến với Check Chăm Chỉ!',
    icon: '🎒',
    category: 'Đặc biệt',
    condition: () => true,
    progress: () => ({ current: 1, target: 1 }),
  },
];

// Tạo danh sách tổng hợp cho UI (bao gồm cả achievement và shop/gacha)
export const ALL_TITLES: TitleDefinition[] = [
  ...TITLE_LIST,
  ...SHOP_TITLES.map((st) => ({
    id: st.id,
    name: st.name,
    description: st.description || '',
    icon: st.icon,
    category: 'Shop',
    condition: () => false, // Không tự mở qua achievement
    progress: () => ({ current: 0, target: 0 }),
  })),
  ...GACHA_TITLES.map((gt) => ({   // Thêm Gacha titles
    id: gt.id,
    name: gt.name,
    description: gt.description || '',
    icon: gt.icon,
    category: 'Lucky Box',
    condition: () => false,
    progress: () => null,
  })),
];