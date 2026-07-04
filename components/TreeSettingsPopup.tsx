'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TREE_TITLE_LIST } from '@/config/treeTitles';

interface Props {
  onClose: () => void;
}

export default function TreeSettingsPopup({ onClose }: Props) {
  const tree = useAppStore((state) => state.tree);
  const setTreeName = useAppStore((state) => state.setTreeName);
  const setTreeImage = useAppStore((state) => state.setTreeImage);
  const equipTreeTitle = useAppStore((state) => state.equipTreeTitle);

  const [name, setName] = useState(tree.name);
  const [image, setImage] = useState(tree.image);
  const [selectedTitleId, setSelectedTitleId] = useState(tree.equippedTitleId || '');

  const handleSave = () => {
    if (name.trim().length <= 15) setTreeName(name.trim());
    setTreeImage(image);
    equipTreeTitle(selectedTitleId);
    onClose();
  };

  const unlockedTitles = TREE_TITLE_LIST.filter((t) => tree.level >= t.minLevel);

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">🌳 Cài đặt cây</h2>

        {/* Tên cây */}
        <label className="block text-sm font-medium mb-1">Tên cây (tối đa 15 ký tự)</label>
        <input
          type="text"
          maxLength={15}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />

        {/* Ảnh cây */}
        <label className="block text-sm font-medium mb-1">Ảnh cây (URL)</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />

        {/* Danh hiệu */}
        <label className="block text-sm font-medium mb-1">Danh hiệu</label>
        <select
          value={selectedTitleId}
          onChange={(e) => setSelectedTitleId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        >
          <option value="">-- Không trang bị --</option>
          {unlockedTitles.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.name}
            </option>
          ))}
        </select>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border">
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">🌱</div>
            )}
          </div>
          <div>
            <p className="font-semibold">{name || 'Bé Đậu'}</p>
            <p className="text-xs text-gray-500">
              {selectedTitleId ? TREE_TITLE_LIST.find(t => t.id === selectedTitleId)?.icon + ' ' + TREE_TITLE_LIST.find(t => t.id === selectedTitleId)?.name : 'Chưa có danh hiệu'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Lưu thay đổi
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Hủy
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}