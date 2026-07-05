'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { SHOP_PETS, SHOP_TITLES } from '@/config/shopItems';
import { GACHA_PETS, GACHA_TITLES } from '@/config/gachaItems';
import { TITLE_LIST } from '@/config/titles';
import type { ShopPet, ShopTitle } from '@/config/types';
import { getRarityStyle } from '@/config/rarity';

interface Props {
  onClose: () => void;
}

// Gom tất cả item thành một kiểu chung
interface CollectionItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  imageUrl?: string;   // chỉ có ở pet
  icon?: string;       // title
  source: 'shop' | 'gacha' | 'achievement';
  type: 'pet' | 'title';
  price?: number;
}

export default function AlmanacPopup({ onClose }: Props) {
  const [tab, setTab] = useState<'pets' | 'titles'>('pets');
  const [rarityFilter, setRarityFilter] = useState<string>('all'); // Thêm state quản lý filter

  const userPets = useAppStore((s) => s.userPets);
  const userTitles = useAppStore((s) => s.userTitles);
  const equippedPet = useAppStore((s) => s.equippedPet);
  const equippedTitle = useAppStore((s) => s.equippedTitle);
  const equipPet = useAppStore((s) => s.equipPet);
  const unequipPet = useAppStore((s) => s.unequipPet);
  const equipTitle = useAppStore((s) => s.equipTitle);
  const unequipTitle = useAppStore((s) => s.unequipTitle);

  // Tạo danh sách Pet
  const allPets: CollectionItem[] = [
    ...SHOP_PETS.map(p => ({ ...p, source: 'shop' as const, type: 'pet' as const })),
    ...GACHA_PETS.map(p => ({ ...p, source: 'gacha' as const, type: 'pet' as const })),
  ];

  // Tạo danh sách Title
  const allTitles: CollectionItem[] = [
    ...TITLE_LIST.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      rarity: 'common', // Gán mặc định cho achievement nếu không có
      icon: t.icon,
      source: 'achievement' as const,
      type: 'title' as const,
    })),
    ...SHOP_TITLES.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      rarity: t.rarity,
      icon: t.icon,
      source: 'shop' as const,
      type: 'title' as const,
    })),
    ...GACHA_TITLES.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      rarity: t.rarity,
      icon: t.icon,
      source: 'gacha' as const,
      type: 'title' as const,
    })),
  ];

  // 1. Định nghĩa trọng số để sắp xếp (Thêm hạng UR lớn nhất)
  const rarityWeight: Record<string, number> = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    ur: 5,
  };

  // 2. Lấy dữ liệu và tạo bản sao để sắp xếp
  const rawItems = tab === 'pets' ? allPets : allTitles;
  const sortedBaseItems = [...rawItems].sort((a, b) => {
    const weightA = rarityWeight[a.rarity?.toLowerCase() || 'common'] || 99;
    const weightB = rarityWeight[b.rarity?.toLowerCase() || 'common'] || 99;
    return weightA - weightB; // Tăng dần: Common -> Rare -> Epic -> Legendary -> UR
  });

  // 3. Áp dụng logic lọc item theo tab và rarity trên mảng đã sắp xếp
  const currentItems = rarityFilter === 'all' 
    ? sortedBaseItems 
    : sortedBaseItems.filter(item => item.rarity?.toLowerCase() === rarityFilter);

  const sourceLabels: Record<string, string> = {
    shop: 'Shop',
    gacha: 'Lucky Box',
    achievement: 'Thành tựu',
  };

  // Danh sách các nút phân loại độ hiếm (Đã thêm nút UR)
  const rarityButtons = [
    { id: 'all', label: 'Tất cả' },
    { id: 'ur', label: 'UR' },
    { id: 'legendary', label: 'Legendary' },
    { id: 'epic', label: 'Epic' },
    { id: 'rare', label: 'Rare' },
    { id: 'common', label: 'Common' }
  ];

  const isOwned = (item: CollectionItem) => {
    if (item.type === 'pet') return userPets.includes(item.id);
    return userTitles.includes(item.id);
  };

  const isEquipped = (item: CollectionItem) => {
    if (item.type === 'pet') return equippedPet === item.id;
    return equippedTitle === item.id;
  };

  const handleEquip = (item: CollectionItem) => {
    if (item.type === 'pet') {
      if (isEquipped(item)) unequipPet();
      else equipPet(item.id);
    } else {
      if (isEquipped(item)) unequipTitle();
      else equipTitle(item.id);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📖 Bộ sưu tập</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setTab('pets'); setRarityFilter('all'); }} 
              className={`px-4 py-2 rounded-lg font-medium transition ${
                tab === 'pets' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🐾 Thú cưng
            </button>
            <button
              onClick={() => { setTab('titles'); setRarityFilter('all'); }} 
              className={`px-4 py-2 rounded-lg font-medium transition ${
                tab === 'titles' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏅 Danh hiệu
            </button>
          </div>

          {/* Rarity Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {rarityButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setRarityFilter(btn.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition border ${
                  rarityFilter === btn.id
                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentItems.length > 0 ? (
              currentItems.map((item) => {
                const owned = isOwned(item);
                const equipped = isEquipped(item);
                // Đảm bảo getRarityStyle() của bạn đã cấu hình màu cho 'ur' nhé!
                const rarityStyle = getRarityStyle(item.rarity as any);

                return (
                  <div
                    key={item.id}
                    className={`relative border-2 rounded-xl p-4 flex flex-col items-center text-center transition ${
                      equipped
                        ? 'border-yellow-400 bg-yellow-50'
                        : owned
                        ? `border-green-300 bg-green-50`
                        : 'border-gray-100 bg-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Badge nguồn */}
                    <span className="absolute top-2 left-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                      {sourceLabels[item.source]}
                    </span>

                    {/* Rarity badge */}
                    {item.rarity && (
                      <span className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full border ${rarityStyle.badge}`}>
                        {item.rarity.toUpperCase()}
                      </span>
                    )}

                    {/* Ảnh hoặc Icon */}
                    {item.type === 'pet' ? (
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-full mb-2" />
                    ) : (
                      <span className="text-4xl mb-2">{item.icon}</span>
                    )}

                    <h3 className={`font-semibold text-sm ${rarityStyle.name}`}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>

                    {/* Trạng thái */}
                    <div className="mt-2 text-xs font-medium">
                      {equipped ? '⭐ Đang sử dụng' : owned ? '✔ Đã sở hữu' : '❌ Chưa sở hữu'}
                    </div>

                    {/* Nút trang bị nếu sở hữu */}
                    {owned && (
                      <button
                        onClick={() => handleEquip(item)}
                        className={`mt-2 w-full py-1.5 rounded-lg text-sm font-semibold transition ${
                          equipped
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {equipped ? 'Bỏ trang bị' : 'Trang bị'}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 md:col-span-3 text-center text-gray-500 py-8">
                Không tìm thấy vật phẩm nào trong phân loại này.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}