'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TREE_TITLE_LIST } from '@/config/treeTitles';
import TreeSettingsPopup from './TreeSettingsPopup';

export default function TreeDisplay() {
  const tree = useAppStore((state) => state.tree);
  const [showSettings, setShowSettings] = useState(false);

  const equippedTitle = TREE_TITLE_LIST.find(t => t.id === tree.equippedTitleId);
  const xpPercent = Math.min(100, (tree.xp / 100) * 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 flex items-center gap-4 mb-6"
      >
        {/* Avatar cây */}
        <div className="relative">
          <div className="w-23 h-23 rounded-full border-2 border-green-300 overflow-hidden bg-green-50">
            {tree.image ? (
              <img src={tree.image} alt={tree.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🌱
              </div>
            )}
          </div>
          {/* Nút cài đặt */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
            title="Cài đặt cây"
          >
            ⚙️
          </button>
        </div>

        {/* Thông tin */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{tree.name}</h3>
            <span className="text-lg font-bold text-gray-500">Lv. {tree.level}</span>
          </div>
          {/* Thanh XP */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-basic text-gray-500 mt-1">{tree.xp} / 100 XP</p>
          {equippedTitle && (
            <div className="mt-1 text-basic font-medium text-green-700 bg-green-50 rounded-lg px-2 py-0.5 inline-block">
              {equippedTitle.icon} {equippedTitle.name}
            </div>
          )}
        </div>
      </motion.div>

      {/* Popup cài đặt */}
      {showSettings && (
        <TreeSettingsPopup onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}