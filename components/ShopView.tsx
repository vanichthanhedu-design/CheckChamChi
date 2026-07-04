'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SHOP_PETS, SHOP_TITLES } from '@/config/shopItems';
import type { ShopPet, ShopTitle } from '@/config/types';
import { getRarityStyle } from '@/config/rarity';

export default function ShopView() {
  const [activeTab, setActiveTab] = useState<'pets' | 'titles'>('pets');
  const [rarityFilter, setRarityFilter] = useState<string>('all'); // Thêm state quản lý filter
  const [message, setMessage] = useState<string | null>(null);

  const profile = useAppStore((s) => s.profile);
  const userPets = useAppStore((s) => s.userPets);
  const userTitles = useAppStore((s) => s.userTitles);
  const buyItem = useAppStore((s) => s.buyItem);

  const handleBuy = (item: ShopPet | ShopTitle, type: 'pet' | 'title') => {
    const success = buyItem(item.id, type);
    if (success) {
      setMessage(`✅ Đã mua "${item.name}"!`);
    } else {
      const alreadyOwned = type === 'pet'
        ? userPets.includes(item.id)
        : userTitles.includes(item.id);
      if (alreadyOwned) {
        setMessage('⚠️ Bạn đã sở hữu vật phẩm này rồi.');
      } else {
        setMessage('❌ Không đủ Coin!');
      }
    }
    setTimeout(() => setMessage(null), 2000);
  };

  // 1. Định nghĩa trọng số để sắp xếp (số càng nhỏ xếp càng trước)
  const rarityWeight: Record<string, number> = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
  };

  // 2. Lấy dữ liệu và tạo bản sao để sắp xếp (tránh làm thay đổi mảng gốc)
  const rawItems = activeTab === 'pets' ? SHOP_PETS : SHOP_TITLES;
  const sortedBaseItems = [...rawItems].sort((a, b) => {
    const weightA = rarityWeight[a.rarity?.toLowerCase() || 'common'] || 99;
    const weightB = rarityWeight[b.rarity?.toLowerCase() || 'common'] || 99;
    return weightA - weightB; // Tăng dần: Common -> Rare -> Epic -> Legendary
  });

  // 3. Áp dụng logic lọc trên mảng đã sắp xếp
  const currentItems = rarityFilter === 'all' 
    ? sortedBaseItems 
    : sortedBaseItems.filter(item => item.rarity?.toLowerCase() === rarityFilter);

  // Danh sách các nút phân loại độ hiếm
  const rarityButtons = [
    { id: 'all', label: 'Tất cả' },
    { id: 'legendary', label: 'Legendary' },
    { id: 'epic', label: 'Epic' },
    { id: 'rare', label: 'Rare' },
    { id: 'common', label: 'Common' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🛍️ Cửa hàng</h1>
        <span className="text-lg font-semibold text-yellow-600">
          🪙 {profile.coins} Coin
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('pets'); setRarityFilter('all'); }} // Reset filter khi đổi tab
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            activeTab === 'pets'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🐾 Thú cưng
        </button>
        <button
          onClick={() => { setActiveTab('titles'); setRarityFilter('all'); }} // Reset filter khi đổi tab
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            activeTab === 'titles'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏅 Danh hiệu
        </button>
      </div>

      {/* Rarity Filters */}
      <div className="flex flex-wrap gap-2">
        {rarityButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setRarityFilter(btn.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              rarityFilter === btn.id
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="p-3 bg-gray-100 rounded-lg text-sm font-medium text-center">
          {message}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.length > 0 ? (
          currentItems.map((item) => {
            const isPet = 'imageUrl' in item;
            const isOwned = isPet
              ? userPets.includes(item.id)
              : userTitles.includes(item.id);
            
            // Lấy style từ config
            const rarityStyle = getRarityStyle(item.rarity);

            return (
              <div
                key={item.id}
                className={`relative border-2 rounded-xl p-4 flex flex-col items-center text-center transition ${
                  isOwned
                    ? 'opacity-60 bg-gray-50 border-gray-200'
                    : 'border-gray-100 hover:shadow-md hover:border-blue-300'
                }`}
              >
                {/* Badge độ hiếm – dùng inline style an toàn */}
                <span
                  style={{
                    backgroundColor: rarityStyle.badgeBg,
                    color: rarityStyle.badgeText,
                    borderColor: rarityStyle.badgeBorder,
                  }}
                  className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold border"
                >
                  {item.rarity}
                </span>

                {/* Ảnh / Icon */}
                {isPet ? (
                  <img
                    src={(item as ShopPet).imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-full mb-3"
                  />
                ) : (
                  <span className="text-5xl mb-3">{(item as ShopTitle).icon}</span>
                )}

                {/* Tên (màu theo độ hiếm) */}
                <p className={`font-semibold text-sm mb-1 ${rarityStyle.name}`}>
                  {item.name}
                </p>

                {/* Mô tả ngắn */}
                <p className="text-xs text-gray-500 mb-2 px-2">
                  {item.description}
                </p>

                {/* Giá */}
                <p className="text-xs text-yellow-600 font-medium mb-3">
                  🪙 {item.price} Coin
                </p>

                {/* Nút mua */}
                <button
                  onClick={() => handleBuy(item, isPet ? 'pet' : 'title')}
                  disabled={isOwned}
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition ${
                    isOwned
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isOwned ? 'Đã sở hữu' : 'Mua'}
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Không có vật phẩm nào trong phân loại này.
          </div>
        )}
      </div>
    </div>
  );
}