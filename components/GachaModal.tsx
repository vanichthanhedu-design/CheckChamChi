'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { GACHA_COST, DUPLICATE_REFUND } from '@/config/gachaItems';
import type { GACHA_PETS, GACHA_TITLES } from '@/config/gachaItems';
import { getRarityStyle } from '@/config/rarity';
import { ShopTitle } from '@/config/types';

interface Props {
  onClose: () => void;
}

export default function GachaModal({ onClose }: Props) {
  const gachaPullByType = useAppStore((s) => s.gachaPullByType);
  const [tab, setTab] = useState<'pet' | 'title'>('pet');
  const profile = useAppStore((s) => s.profile);
  const gachaPull = useAppStore((s) => s.gachaPull);
  const equipPet = useAppStore((s) => s.equipPet);

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{
    item: typeof GACHA_PETS[number] | typeof GACHA_TITLES[number];
    isDuplicate: boolean;
  } | null>(null);

  const handlePull = () => {
    if (spinning || profile.coins < GACHA_COST) return;
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      const pullResult = gachaPullByType(tab);
      if (pullResult) setResult(pullResult);
      setSpinning(false);
    }, 2000);
  };

  const handleEquip = () => {
    if (result && !result.isDuplicate && 'imageUrl' in result.item) {
      equipPet(result.item.id);
    }
    setResult(null);
  };

  const isPet = (item: typeof GACHA_PETS[number] | typeof GACHA_TITLES[number]): item is typeof GACHA_PETS[number] => 'imageUrl' in item;
  const rarityStyle = result ? getRarityStyle(result.item.rarity) : null;

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
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🎁 Lucky Box</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-yellow-600">
                🪙 {profile.coins} Coin
              </span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => { setTab('pet'); setResult(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                tab === 'pet' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🐾 Thú cưng
            </button>
            <button
              onClick={() => { setTab('title'); setResult(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                tab === 'title' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏅 Danh hiệu
            </button>
          </div>

          <div className="relative w-48 h-48 mx-auto mb-6">
            <motion.div
              className="w-full h-full rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-inner flex items-center justify-center text-6xl"
              animate={
                spinning
                  ? {
                      rotate: [0, -5, 5, -5, 0],
                      scale: [1, 1.05, 1, 1.05, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
            >
              🎁
            </motion.div>

            {result && rarityStyle && (
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${rarityStyle.gradient} opacity-30`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
          
          {!result && (
            <button
              onClick={handlePull}
              disabled={spinning || profile.coins < GACHA_COST}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition ${
                spinning || profile.coins < GACHA_COST
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {spinning ? 'Đang quay...' : `Quay (${GACHA_COST} 🪙)`}
            </button>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 space-y-3"
              >
                <div className="p-4 bg-gray-50 rounded-xl">
                  {/* Luôn hiển thị hình ảnh/icon của vật phẩm */}
                  <div className="flex justify-center mb-2">
                    {isPet(result.item) ? (
                      <img
                        src={result.item.imageUrl}
                        alt={result.item.name}
                        className={`w-20 h-20 object-cover rounded-full border-2 ${rarityStyle?.border}`}
                      />
                    ) : (
                      <span className="text-5xl">
                        {(result.item as ShopTitle).icon}
                      </span>
                    )}
                  </div>

                  {/* Tên vật phẩm (có màu theo độ hiếm) */}
                  <p className={`font-bold text-lg ${rarityStyle?.name}`}>
                    {result.item.name}
                  </p>

                  {/* Độ hiếm */}
                  <p className="text-sm text-gray-500">
                    {result.item.rarity.toUpperCase()}
                  </p>

                  {/* Dòng thông báo trùng lặp hoặc chúc mừng */}
                  {result.isDuplicate ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-orange-600">
                        🔄 Bạn đã sở hữu vật phẩm này rồi!
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Được hoàn lại +{DUPLICATE_REFUND} 🪙
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-600">
                        🎉 Chúc mừng! Bạn đã nhận được vật phẩm mới!
                      </p>
                    </div>
                  )}
                </div>

                {/* Các nút hành động (giữ nguyên logic cũ) */}
                <div className="flex gap-2">
                  {!result.isDuplicate && isPet(result.item) && (
                    <button
                      onClick={handleEquip}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
                    >
                      Trang bị ngay
                    </button>
                  )}
                  <button
                    onClick={() => setResult(null)}
                    className={`py-2 rounded-xl font-semibold transition ${
                      !result.isDuplicate && isPet(result.item)
                        ? 'flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'w-full bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}