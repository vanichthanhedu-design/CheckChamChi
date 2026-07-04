'use client';
import { motion, AnimatePresence } from 'framer-motion';
import LuckyWheel from './LuckyWheel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRewardId: number;
}

export default function WheelModal({ isOpen, onClose, targetRewardId }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <LuckyWheel targetRewardId={targetRewardId} onSpinEnd={onClose} />
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Đóng
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}