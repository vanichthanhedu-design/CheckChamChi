'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  titleName: string;
  titleIcon: string;
  onClose: () => void;
}

export default function TitleUnlockToast({ titleName, titleIcon, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 bg-yellow-100 border border-yellow-400 rounded-xl p-4 shadow-lg z-50"
      >
        <p className="font-bold text-lg">🏅 Danh hiệu mới!</p>
        <p className="flex items-center gap-2 text-xl">
          {titleIcon} {titleName}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}