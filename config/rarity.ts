export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'UR';

export interface RarityStyle {
  bg: string;            // class Tailwind
  text: string;
  border: string;
  badge: string;         // class Tailwind (dành cho Almanac)
  name: string;
  gradient: string;
  badgeBg: string;       // màu nền hex
  badgeText: string;     // màu chữ hex
  badgeBorder: string;   // màu viền hex
}

export const RARITY_STYLES: Record<Rarity, RarityStyle> = {
  Common: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    badge: 'bg-gray-200 text-gray-700 border-gray-300',
    name: 'text-gray-700',
    gradient: 'from-gray-300 to-gray-400',
    badgeBg: '#E5E7EB',
    badgeText: '#374151',
    badgeBorder: '#D1D5DB',
  },
  Rare: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
    badge: 'bg-green-200 text-green-700 border-green-300',
    name: 'text-green-700',
    gradient: 'from-green-400 to-green-600',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    badgeBorder: '#6EE7B7',
  },
  Epic: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
    badge: 'bg-purple-200 text-purple-700 border-purple-300',
    name: 'text-purple-700',
    gradient: 'from-purple-400 to-purple-600',
    badgeBg: '#EDE9FE',
    badgeText: '#5B21B6',
    badgeBorder: '#C4B5FD',
  },
  Legendary: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    badge: 'bg-yellow-200 text-yellow-700 border-yellow-300',
    name: 'text-yellow-700',
    gradient: 'from-yellow-400 to-yellow-600',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    badgeBorder: '#FCD34D',
  },
  UR: {
  bg: 'bg-red-100',
  text: 'text-red-700',
  border: 'border-red-300',
  badge: 'bg-red-200 text-red-700 border-red-300',
  name: 'text-red-700',
  gradient: 'from-red-400 to-red-600',
  badgeBg: '#FEE2E2',   // đỏ nhạt
  badgeText: '#991B1B',  // đỏ đậm
  badgeBorder: '#FCA5A5',
},
};

export function getRarityStyle(rarity?: string): RarityStyle {
  const key = (rarity || 'Common') as Rarity;
  return RARITY_STYLES[key] || RARITY_STYLES.Common;
}