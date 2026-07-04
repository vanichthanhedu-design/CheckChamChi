// src/store/useAppStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { TITLE_LIST } from '@/config/titles';
import { getTreeTitleForLevel, TREE_TITLE_LIST } from '@/config/treeTitles';
import { SHOP_PETS, SHOP_TITLES } from '@/config/shopItems';
import { GACHA_PETS, GACHA_TITLES, GACHA_RATES, GACHA_COST, DUPLICATE_REFUND } from '@/config/gachaItems';
import type { ShopPet, ShopTitle } from '@/config/types';
import { getRarityStyle } from '@/config/rarity';

// ============================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU
// ============================================

interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastCheckinDate: string | null;
  shieldCount: number;
}

interface CheckinDay {
  status: 'completed' | 'missed' | 'shielded';
  earnedCoin: boolean;
  completedMissionIds: number[];
  evidenceNote?: string;
  evidenceImage?: string;
  mood?: 'stress' | 'negative' | 'neutral' | 'happy' | 'blissful';
  moodAdvice?: string;
  missionCoinCount: number;
}

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  task: string;
  completed: boolean;
}

export interface DailyPlan {
  date: string;
  timeSlots: TimeSlot[];
}

export interface TodosData {
  quickNote: string;
  goals: Goal[];
  dailyPlans: { [date: string]: DailyPlan };
}

export interface TreeData {
  name: string;
  image: string;
  level: number;
  xp: number;
  totalFocusMinutes: number;
  equippedTitleId: string | null;
}

export interface Mission {
  id: number;
  group: 'learning' | 'physical';
  name: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Reward {
  id: number;
  name: string;
  rarity: 'common' | 'normal' | 'good' | 'rare' | 'super_rare';
  probability: number;
  isDefault: boolean;
}

interface RewardHistoryEntry {
  id: string;
  rewardId: number;
  wonAt: string;
}

export interface FocusMode {
  status: 'idle' | 'running' | 'paused';
  startTime: number | null;
  pausedAt: number | null;
  accumulatedSeconds: number;
  targetSeconds: number;
  backgroundUrl: string;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: AppState) => boolean;
}

export interface AppState {
  profile: {
    username: string;
    avatar: string;
    theme: 'light' | 'dark';
    primaryColor: string;
    coins: number;
  };
  streaks: Streak;
  checkinHistory: { [date: string]: CheckinDay };
  missions: Mission[];
  rewards: Reward[];
  rewardHistory: RewardHistoryEntry[];
  userTitles: string[];
  equippedTitle: string | null;
  newTitleId: string | null;
  focusMode: FocusMode;
  tree: TreeData;
  todos: TodosData;
  userPets: string[];
  equippedPet: string | null;
}

export interface AppActions {
  initializeData: () => void;
  checkinToday: () => void;
  toggleMission: (missionId: number) => void;
  addMission: (mission: Omit<Mission, 'id'>) => void;
  deleteMission: (id: number) => void;
  updateMission: (id: number, updates: Partial<Omit<Mission, 'id'>>) => void;
  spinWheel: () => Reward | null;
  addCustomReward: (reward: Omit<Reward, 'id' | 'isDefault'>) => void;
  updateReward: (id: number, updates: Partial<Omit<Reward, 'id' | 'isDefault'>>) => void;
  deleteReward: (id: number) => void;
  updateProfile: (updates: Partial<AppState['profile']>) => void;
  updateJournal: (date: string, data: { note?: string; mood?: CheckinDay['mood']; moodAdvice?: string }) => void;
  resetStreak: () => void;
  useShield: () => boolean;
  equipTitle: (titleId: string) => void;
  unequipTitle: () => void;
  checkTitles: () => void;
  clearNewTitle: () => void;
  startFocus: () => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  stopFocus: () => void;
  setFocusTarget: (seconds: number) => void;
  setFocusBackground: (url: string) => void;
  resetFocus: () => void;
  addTreeXP: (minutes: number) => void;
  setTreeName: (name: string) => void;
  setTreeImage: (url: string) => void;
  equipTreeTitle: (titleId: string) => void;
  setQuickNote: (note: string) => void;
  addGoal: (title: string) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  updateTimeSlot: (date: string, index: number, updates: Partial<TimeSlot>) => void;
  addTimeSlot: (date: string, slot: TimeSlot) => void;
  removeTimeSlot: (date: string, index: number) => void;
  getOrCreateDailyPlan: (date: string) => DailyPlan;
  buyItem: (itemId: string, type: 'pet' | 'title') => boolean;
  gachaPull: () => { item: ShopPet | ShopTitle; isDuplicate: boolean } | null;
  equipPet: (petId: string) => void;
  unequipPet: () => void;
  addCoins: (amount: number) => void;
  addShopTitle: (titleId: string) => void;
}

// ============================================
// DỮ LIỆU MẪU
// ============================================

const defaultMissions: Mission[] = [
  { id: 1, group: 'learning', name: 'Reading', icon: '📖', sortOrder: 1, isActive: true },
  { id: 2, group: 'learning', name: 'Listening', icon: '🎧', sortOrder: 2, isActive: true },
  { id: 3, group: 'learning', name: 'Speaking', icon: '🗣️', sortOrder: 3, isActive: true },
  { id: 4, group: 'learning', name: 'Writing', icon: '✍️', sortOrder: 4, isActive: true },
  { id: 5, group: 'learning', name: 'Vocabulary', icon: '📝', sortOrder: 5, isActive: true },
  { id: 6, group: 'learning', name: 'Shadowing', icon: '🎙️', sortOrder: 6, isActive: true },
  { id: 7, group: 'physical', name: 'Push-up', icon: '💪', sortOrder: 7, isActive: true },
  { id: 8, group: 'physical', name: 'Walk', icon: '🚶', sortOrder: 8, isActive: true },
  { id: 9, group: 'physical', name: 'Running', icon: '🏃', sortOrder: 9, isActive: true },
  { id: 10, group: 'physical', name: 'Stretching', icon: '🧘', sortOrder: 10, isActive: true },
  { id: 11, group: 'physical', name: 'Gym', icon: '🏋️', sortOrder: 11, isActive: true },
  { id: 12, group: 'physical', name: 'Drink Water', icon: '💧', sortOrder: 12, isActive: true },
];

const defaultRewards: Reward[] = [
  { id: 1, name: 'Nghỉ 5 phút', rarity: 'common', probability: 0.30, isDefault: true },
  { id: 2, name: 'Nghỉ 10 phút', rarity: 'normal', probability: 0.25, isDefault: true },
  { id: 3, name: 'Nghỉ 15 phút', rarity: 'good', probability: 0.20, isDefault: true },
  { id: 4, name: 'Nghỉ 20 phút', rarity: 'rare', probability: 0.10, isDefault: true },
  { id: 5, name: 'Nghỉ 30 phút', rarity: 'super_rare', probability: 0.05, isDefault: true },
  { id: 6, name: 'Uống trà sữa', rarity: 'rare', probability: 0.05, isDefault: true },
  { id: 7, name: 'Xem MXH 15 phút', rarity: 'rare', probability: 0.04, isDefault: true },
  { id: 8, name: 'Đi chơi cuối tuần (tích 4 thẻ)', rarity: 'super_rare', probability: 0.01, isDefault: true },
];

const initialState: AppState = {
  userPets: [],
  equippedPet: null,
  todos: {
    quickNote: '',
    goals: [],
    dailyPlans: {},
  },
  tree: {
    name: 'Bé Đậu Chăm Chỉ',
    image: '',
    level: 1,
    xp: 0,
    totalFocusMinutes: 0,
    equippedTitleId: null,
  },
  profile: {
    username: 'Người Chăm Chỉ',
    avatar: '',
    theme: 'light',
    primaryColor: '#3B82F6',
    coins: 5000,
  },
  streaks: {
    currentStreak: 0,
    longestStreak: 0,
    lastCheckinDate: null,
    shieldCount: 2,
  },
  checkinHistory: {},
  missions: defaultMissions,
  rewards: defaultRewards,
  rewardHistory: [],
  userTitles: [],
  equippedTitle: null,
  newTitleId: null,
  focusMode: {
    status: 'idle',
    startTime: null,
    pausedAt: null,
    accumulatedSeconds: 0,
    targetSeconds: 25 * 60,
    backgroundUrl: '',
  },
};

// ============================================
// TẠO STORE
// ============================================

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      gachaPull: () => {
        const state = get();
        if (state.profile.coins < GACHA_COST) return null;

        const newCoin = state.profile.coins - GACHA_COST;

        // Logic random với chữ hoa
        const totalWeight = GACHA_RATES.Common + GACHA_RATES.Rare + GACHA_RATES.Epic + GACHA_RATES.Legendary;
        let random = Math.random() * totalWeight;
        
        let rarity = 'Common';
        if (random < GACHA_RATES.Legendary) rarity = 'Legendary';
        else if (random < GACHA_RATES.Legendary + GACHA_RATES.Epic) rarity = 'Epic';
        else if (random < GACHA_RATES.Legendary + GACHA_RATES.Epic + GACHA_RATES.Rare) rarity = 'Rare';

        // Pool từ Gacha
        const pool: (ShopPet | ShopTitle)[] = [
          ...GACHA_PETS.filter(p => p.rarity === rarity),
          ...GACHA_TITLES.filter(t => t.rarity === rarity),
        ];

        if (pool.length === 0) {
          // Hoàn lại coin nếu không có item nào
          set({ profile: { ...state.profile, coins: state.profile.coins } });
          return null;
        }

        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        const isPet = 'imageUrl' in randomItem;
        const isDuplicate = isPet
          ? state.userPets.includes(randomItem.id)
          : state.userTitles.includes(randomItem.id);

        if (isDuplicate) {
          set({
            profile: { ...state.profile, coins: newCoin + DUPLICATE_REFUND },
          });
          return { item: randomItem, isDuplicate: true };
        }

        if (isPet) {
          set({
            profile: { ...state.profile, coins: newCoin },
            userPets: [...state.userPets, randomItem.id],
          });
        } else {
          set({
            profile: { ...state.profile, coins: newCoin },
            userTitles: [...state.userTitles, randomItem.id],
          });
        }

        return { item: randomItem, isDuplicate: false };
      },

      buyItem: (itemId, type) => {
        const state = get();
        const price = type === 'pet'
          ? SHOP_PETS.find(p => p.id === itemId)?.price
          : SHOP_TITLES.find(t => t.id === itemId)?.price;

        if (!price) return false;

        const alreadyOwned = type === 'pet'
          ? state.userPets.includes(itemId)
          : state.userTitles.includes(itemId);

        if (alreadyOwned) return false;
        if (state.profile.coins < price) return false;

        if (type === 'pet') {
          set({
            profile: { ...state.profile, coins: state.profile.coins - price },
            userPets: [...state.userPets, itemId],
          });
        } else {
          set({
            profile: { ...state.profile, coins: state.profile.coins - price },
            userTitles: [...state.userTitles, itemId],
          });
        }
        return true;
      },

      addShopTitle: (titleId) => {
        const state = get();
        if (!state.userTitles.includes(titleId)) {
          set({ userTitles: [...state.userTitles, titleId] });
        }
      },

      equipPet: (petId) => {
        if (get().userPets.includes(petId)) {
          set({ equippedPet: petId });
        }
      },
      unequipPet: () => {
        set({ equippedPet: null });
      },

      addCoins: (amount) => {
        set((state) => ({
          profile: { ...state.profile, coins: state.profile.coins + amount },
        }));
      },

      setQuickNote: (note) => set((state) => ({
        todos: { ...state.todos, quickNote: note },
      })),

      addGoal: (title) => {
        const newGoal: Goal = {
          id: uuidv4(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          todos: { ...state.todos, goals: [...state.todos.goals, newGoal] },
        }));
      },

      toggleGoal: (id) => set((state) => ({
        todos: {
          ...state.todos,
          goals: state.todos.goals.map(g =>
            g.id === id ? { ...g, completed: !g.completed } : g
          ),
        },
      })),

      deleteGoal: (id) => set((state) => ({
        todos: {
          ...state.todos,
          goals: state.todos.goals.filter(g => g.id !== id),
        },
      })),

      getOrCreateDailyPlan: (date) => {
        const state = get();
        const plan = state.todos.dailyPlans[date];
        if (plan) return plan;
        const newPlan: DailyPlan = {
          date,
          timeSlots: [
            ...Array.from({ length: 6 }, (_, i) => ({
              time: `${(7 + i).toString().padStart(2, '0')}:00`,
              task: '',
              completed: false,
            })),
            ...Array.from({ length: 6 }, (_, i) => ({
              time: `${(13 + i).toString().padStart(2, '0')}:00`,
              task: '',
              completed: false,
            })),
          ],
        };
        set((state) => ({
          todos: {
            ...state.todos,
            dailyPlans: { ...state.todos.dailyPlans, [date]: newPlan },
          },
        }));
        return newPlan;
      },

      updateTimeSlot: (date, index, updates) => set((state) => {
        const plans = { ...state.todos.dailyPlans };
        const plan = plans[date];
        if (!plan) return state;
        const timeSlots = [...plan.timeSlots];
        timeSlots[index] = { ...timeSlots[index], ...updates };
        plans[date] = { ...plan, timeSlots };
        return { todos: { ...state.todos, dailyPlans: plans } };
      }),

      addTimeSlot: (date, slot) => set((state) => {
        const plans = { ...state.todos.dailyPlans };
        const plan = plans[date];
        if (!plan) return state;
        plans[date] = { ...plan, timeSlots: [...plan.timeSlots, slot] };
        return { todos: { ...state.todos, dailyPlans: plans } };
      }),

      removeTimeSlot: (date, index) => set((state) => {
        const plans = { ...state.todos.dailyPlans };
        const plan = plans[date];
        if (!plan) return state;
        plans[date] = { ...plan, timeSlots: plan.timeSlots.filter((_, i) => i !== index) };
        return { todos: { ...state.todos, dailyPlans: plans } };
      }),

      addTreeXP: (minutes) => {
        const state = get();
        let { level, xp, totalFocusMinutes } = state.tree;
        totalFocusMinutes += minutes;
        xp += minutes;

        while (xp >= 100) {
          xp -= 100;
          level += 1;
        }

        const newTitle = getTreeTitleForLevel(level);
        const currentTitleId = state.tree.equippedTitleId;

        let updatedTitleId = currentTitleId;
        if (newTitle) {
          const currentTitle = TREE_TITLE_LIST.find(t => t.id === currentTitleId);
          if (!currentTitle || level > currentTitle.maxLevel) {
            updatedTitleId = newTitle.id;
          }
        }

        set({
          tree: {
            ...state.tree,
            level,
            xp,
            totalFocusMinutes,
            equippedTitleId: updatedTitleId,
          },
        });
      },

      setTreeName: (name) => set((state) => ({ tree: { ...state.tree, name } })),
      setTreeImage: (url) => set((state) => ({ tree: { ...state.tree, image: url } })),
      equipTreeTitle: (titleId) => set((state) => ({ tree: { ...state.tree, equippedTitleId: titleId } })),

      initializeData: () => {
        const state = get();
        if (!state.missions || state.missions.length === 0) set({ missions: defaultMissions });
        if (!state.rewards || state.rewards.length === 0) set({ rewards: defaultRewards });
        get().checkTitles();
      },

      checkinToday: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const history = state.checkinHistory;
        if (history[today]?.status === 'completed') return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const yesterdayCompleted = history[yesterday]?.status === 'completed';
        let newStreak = state.streaks.currentStreak;
        newStreak = yesterdayCompleted ? newStreak + 1 : 1;
        const newLongest = Math.max(newStreak, state.streaks.longestStreak);

        set({
          streaks: {
            ...state.streaks,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastCheckinDate: today,
          },
          checkinHistory: {
            ...history,
            [today]: {
              status: 'completed',
              earnedCoin: false,
              completedMissionIds: [],
              missionCoinCount: 0,
            },
          },
        });
        get().checkTitles();
      },

      toggleMission: (missionId: number) => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const todayData = state.checkinHistory[today];
        if (!todayData || todayData.status !== 'completed') return;

        const isCompleted = todayData.completedMissionIds.includes(missionId);
        const isAdding = !isCompleted;

        const newMissionIds = isAdding
          ? [...todayData.completedMissionIds, missionId]
          : todayData.completedMissionIds.filter(id => id !== missionId);

        let newCoinBalance = state.profile.coins;
        let newMissionCoinCount = todayData.missionCoinCount || 0;

        if (isAdding && newMissionCoinCount < 4) {
          newCoinBalance += 10;
          newMissionCoinCount += 1;
        }

        const activeMissions = state.missions.filter(m => m.isActive);
        const allCompleted = activeMissions.every(m => newMissionIds.includes(m.id));
        let earnedCoin = todayData.earnedCoin;

        if (allCompleted && !earnedCoin) {
          newCoinBalance += 50;
          earnedCoin = true;
        }

        set({
          checkinHistory: {
            ...state.checkinHistory,
            [today]: {
              ...todayData,
              completedMissionIds: newMissionIds,
              missionCoinCount: newMissionCoinCount,
              earnedCoin,
            },
          },
          profile: {
            ...state.profile,
            coins: newCoinBalance,
          },
        });
        get().checkTitles();
      },

      addMission: (missionData) => {
        const newMission: Mission = { ...missionData, id: Date.now() };
        set((state) => ({ missions: [...state.missions, newMission] }));
      },
      deleteMission: (id) => set((state) => ({ missions: state.missions.filter(m => m.id !== id) })),
      updateMission: (id, updates) => set((state) => ({
        missions: state.missions.map(m => m.id === id ? { ...m, ...updates } : m),
      })),

      spinWheel: () => {
        const state = get();
        const rewards = state.rewards;
        const totalProb = rewards.reduce((sum, r) => sum + r.probability, 0);
        let random = Math.random() * totalProb;
        for (const reward of rewards) {
          if (random < reward.probability) {
            set({ rewardHistory: [...state.rewardHistory, { id: uuidv4(), rewardId: reward.id, wonAt: new Date().toISOString() }] });
            return reward;
          }
          random -= reward.probability;
        }
        return rewards[rewards.length - 1];
      },

      addCustomReward: (rewardData) => {
        const newReward: Reward = { ...rewardData, id: Date.now(), isDefault: false };
        set((state) => ({ rewards: [...state.rewards, newReward] }));
      },
      updateReward: (id, updates) => set((state) => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, ...updates } : r),
      })),
      deleteReward: (id) => set((state) => ({ rewards: state.rewards.filter(r => r.id !== id) })),

      updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),

      updateJournal: (date, data) => {
        const state = get();
        const currentDay = state.checkinHistory[date] || {
          status: 'missed' as const,
          earnedCoin: false,
          completedMissionIds: [],
          missionCoinCount: 0,
        };
        set({
          checkinHistory: {
            ...state.checkinHistory,
            [date]: {
              ...currentDay,
              evidenceNote: data.note !== undefined ? data.note : currentDay.evidenceNote,
              mood: data.mood !== undefined ? data.mood : currentDay.mood,
              moodAdvice: data.moodAdvice !== undefined ? data.moodAdvice : currentDay.moodAdvice,
            },
          },
        });
      },

      resetStreak: () => set((state) => ({
        streaks: { ...state.streaks, currentStreak: 0, lastCheckinDate: new Date().toISOString().split('T')[0] },
      })),
      useShield: () => {
        const state = get();
        if (state.streaks.shieldCount <= 0) return false;
        const today = new Date().toISOString().split('T')[0];
        set({
          streaks: { ...state.streaks, shieldCount: state.streaks.shieldCount - 1 },
          checkinHistory: {
            ...state.checkinHistory,
            [today]: {
              status: 'shielded',
              earnedCoin: false,
              completedMissionIds: [],
              missionCoinCount: 0,
            },
          },
        });
        return true;
      },

      equipTitle: (titleId) => {
        if (get().userTitles.includes(titleId)) set({ equippedTitle: titleId });
      },
      unequipTitle: () => set({ equippedTitle: null }),
      checkTitles: () => {
        const state = get();
        const unlocked = state.userTitles;
        const newTitles: string[] = [];
        TITLE_LIST.forEach((title) => {
          if (!unlocked.includes(title.id) && title.condition(state)) newTitles.push(title.id);
        });
        if (newTitles.length > 0) {
          set({ userTitles: [...unlocked, ...newTitles], newTitleId: newTitles[0] });
        }
      },
      clearNewTitle: () => set({ newTitleId: null }),

      startFocus: () => {
        const now = Date.now();
        set((state) => ({
          focusMode: { ...state.focusMode, status: 'running', startTime: now, accumulatedSeconds: 0, pausedAt: null },
        }));
      },
      pauseFocus: () => {
        const now = Date.now();
        const state = get();
        if (state.focusMode.status !== 'running') return;
        const elapsed = (now - (state.focusMode.startTime || now)) / 1000;
        set({
          focusMode: {
            ...state.focusMode,
            status: 'paused',
            accumulatedSeconds: state.focusMode.accumulatedSeconds + elapsed,
            pausedAt: now,
          },
        });
      },
      resumeFocus: () => {
        const now = Date.now();
        const state = get();
        if (state.focusMode.status !== 'paused') return;
        set({
          focusMode: { ...state.focusMode, status: 'running', startTime: now, pausedAt: null },
        });
      },
      stopFocus: () => {
        set((state) => ({
          focusMode: { ...state.focusMode, status: 'idle', startTime: null, accumulatedSeconds: 0, pausedAt: null },
        }));
      },
      setFocusTarget: (seconds) => set((state) => ({ focusMode: { ...state.focusMode, targetSeconds: seconds } })),
      setFocusBackground: (url) => set((state) => ({ focusMode: { ...state.focusMode, backgroundUrl: url } })),
      resetFocus: () => {
        set({
          focusMode: {
            status: 'idle',
            startTime: null,
            pausedAt: null,
            accumulatedSeconds: 0,
            targetSeconds: 25 * 60,
            backgroundUrl: '',
          },
        });
      },
    }),
    { name: 'check-cham-chi-storage' }
  )
);