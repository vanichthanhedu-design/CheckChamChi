'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { SHOP_PETS, SHOP_TITLES } from '@/config/shopItems';
import type { ShopPet, ShopTitle } from '@/config/types';
import { getRarityStyle } from '@/config/rarity';

interface Props {
  onClose: () => void;
}

type TabType = 'pets' | 'titles';

export default function ShopPopup({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('pets');
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

  const currentItems = activeTab === 'pets' ? SHOP_PETS : SHOP_TITLES;

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
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🛍️ Cửa hàng</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-yellow-600">
                🪙 {profile.coins} Coin
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('pets')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'pets'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🐾 Thú cưng
            </button>
            <button
              onClick={() => setActiveTab('titles')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'titles'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏅 Danh hiệu
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm font-medium text-center">
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentItems.map((item) => {
              const isPet = 'imageUrl' in item;
              const isOwned = isPet
                ? userPets.includes(item.id)
                : userTitles.includes(item.id);
              
              const rarity = item.rarity || 'Common';
              const rarityStyle = getRarityStyle(rarity);

              return (
                <div
                  key={item.id}
                  className={`relative border-2 rounded-xl p-4 flex flex-col items-center text-center transition ${
                    isOwned
                      ? 'opacity-60 bg-gray-50 border-gray-200'
                      : `${rarityStyle.bg} ${rarityStyle.border} hover:shadow-md`
                  }`}
                >
                  {/* Badge độ hiếm – chỉ dùng inline style, không dùng class từ rarityStyle.badge */}
                  <span
                    style={{
                      backgroundColor: rarityStyle.badgeBg,
                      color: rarityStyle.badgeText,
                      borderColor: rarityStyle.badgeBorder,
                    }}
                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold border"
                  >
                    {rarity}
                  </span>

                  {isPet ? (
                    <img
                      src={(item as ShopPet).imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <span className="text-4xl mb-2">{(item as ShopTitle).icon}</span>
                  )}

                  <p className={`font-semibold text-sm ${rarityStyle.name}`}>
                    {item.name}
                  </p>

                  <p className="text-xs text-yellow-600 font-medium mb-2">
                    🪙 {item.price} Coin
                  </p>

                  <button
                    onClick={() => handleBuy(item, isPet ? 'pet' : 'title')}
                    disabled={isOwned}
                    className={`w-full py-1.5 rounded-lg text-sm font-semibold transition ${
                      isOwned
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isOwned ? 'Đã sở hữu' : 'Mua'}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}