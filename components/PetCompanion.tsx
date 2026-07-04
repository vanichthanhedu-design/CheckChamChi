'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { SHOP_PETS } from '@/config/shopItems';
import { GACHA_PETS } from '@/config/gachaItems';
import { PET_PHRASES } from '@/config/petPhrases';

export default function PetCompanion() {
  const equippedPetId = useAppStore((s) => s.equippedPet);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [showPhrase, setShowPhrase] = useState(false);

  // Gộp tất cả pet từ Shop và Gacha
  const allPets = [...SHOP_PETS, ...GACHA_PETS];
  const pet = equippedPetId ? allPets.find((p) => p.id === equippedPetId) : null;

  // Hiển thị câu thoại ngẫu nhiên mỗi 45-90 giây
  useEffect(() => {
    if (!pet) return;

    const showRandomPhrase = () => {
      const randomPhrase = PET_PHRASES[Math.floor(Math.random() * PET_PHRASES.length)];
      setPhrase(randomPhrase);
      setShowPhrase(true);

      // Ẩn sau 6 giây
      setTimeout(() => {
        setShowPhrase(false);
      }, 6000);
    };

    // Lần đầu sau 5 giây
    const initialTimer = setTimeout(showRandomPhrase, 5000);

    // Định kỳ
    const interval = setInterval(showRandomPhrase, 45000 + Math.random() * 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [pet]);

  if (!pet) return null; // Không có pet thì không hiển thị

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Bong bóng thoại */}
      <AnimatePresence>
        {showPhrase && phrase && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-lg px-4 py-2 max-w-[200px] text-sm text-gray-700 border border-gray-100 relative"
          >
            {phrase}
            {/* Đuôi bong bóng */}
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar pet */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-23 h-23 rounded-full border-2 border-yellow-400 shadow-lg overflow-hidden bg-white cursor-pointer"
        title={pet.name}
      >
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
}