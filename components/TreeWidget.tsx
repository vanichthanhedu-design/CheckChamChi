'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TREE_TITLE_LIST } from '@/config/treeTitles';
import TreeSettingsPopup from '@/components/TreeSettingsPopup';

export default function TreeWidget() {
  const tree = useAppStore((state) => state.tree);
  const [showSettings, setShowSettings] = useState(false);

  const equippedTitle = TREE_TITLE_LIST.find(t => t.id === tree.equippedTitleId);

  const xpPercent = (tree.xp / 100) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 right-4 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 z-30"
      >
        {/* Avatar cây */}
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div className="w-full h-full rounded-full border-2 border-green-300 overflow-hidden bg-green-50">
            {tree.image ? (
              <img src={tree.image} alt={tree.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🌱
              </div>
            )}
          </div>
          {/* Icon bánh răng */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shadow hover:bg-gray-200 transition"
            title="Cài đặt cây"
          >
            ⚙️
          </button>
        </div>

        {/* Tên cây */}
        <h3 className="text-center font-semibold text-gray-800 truncate">{tree.name}</h3>

        {/* Level */}
        <p className="text-xs text-center text-gray-500 mt-1">Lv. {tree.level}</p>

        {/* Thanh XP */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center mt-1">{tree.xp} / 100 XP</p>

        {/* Danh hiệu */}
        {equippedTitle && (
          <div className="mt-2 text-center text-xs font-medium text-green-700 bg-green-50 rounded-lg px-2 py-1">
            {equippedTitle.icon} {equippedTitle.name}
          </div>
        )}
      </motion.div>

      {/* Popup cài đặt cây */}
      <AnimatePresence>
        {showSettings && (
          <TreeSettingsPopup onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </>
  );
}