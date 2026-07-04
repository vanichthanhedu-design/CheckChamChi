'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ALL_TITLES } from '@/config/titles';
import ShopPopup from './ShopPopup';
import GachaModal from './GachaModal';
import AlmanacPopup from './AlmanacPopup';

const tabs = [
  { name: '🏠 Dashboard', href: '/' },
  { name: '📅 Lịch', href: '/calendar' },
  { name: '📔 TODOS', href: '/journal' },
  { name: '📊 Thống kê', href: '/statistics' },
  { name: '🛍️ Cửa hàng', href: '/shop' },
];

export default function Navbar() {
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [showGacha, setShowGacha] = useState(false);
  const [showShop, setShowShop] = useState(false); // Vẫn giữ nguyên nếu bạn dùng sau này
  const pathname = usePathname();
  const router = useRouter();

  // Profile & Titles
  const profile = useAppStore((state) => state.profile);
  const equippedTitleId = useAppStore((state) => state.equippedTitle);
  const equippedTitle = equippedTitleId
    ? ALL_TITLES.find((t) => t.id === equippedTitleId)
    : null;

  // Focus Mode state
  const focusMode = useAppStore((state) => state.focusMode);
  const [focusElapsed, setFocusElapsed] = useState(0);

  // Dropdown menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  // Cập nhật thời gian focus mỗi 200ms
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusMode.status === 'running') {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed =
          focusMode.accumulatedSeconds +
          (focusMode.startTime ? (now - focusMode.startTime) / 1000 : 0);
        setFocusElapsed(elapsed);
      }, 200);
    } else if (focusMode.status === 'paused') {
      setFocusElapsed(focusMode.accumulatedSeconds);
    } else {
      setFocusElapsed(0);
    }
    return () => clearInterval(interval);
  }, [focusMode.status, focusMode.startTime, focusMode.accumulatedSeconds]);

  // Định dạng MM:SS
  const formatFocusTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = () => setMenuOpen(false);

  const avatarSrc = profile.avatar;
  const fallbackIcon = '🙂';

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold text-gray-800 tracking-tight">
          🔥 Check Chăm Chỉ
        </Link>

        {/* Các tab chính */}
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
          {/* Nút Gacha */}
          <button
            onClick={() => setShowGacha(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 transition"
          >
            🎁 Lucky box
          </button>
        </div>

        {/* Khu vực bên phải: Focus Indicator + Avatar + Dropdown */}
        <div className="flex items-center gap-3">
          {/* Focus Indicator */}
          {focusMode.status !== 'idle' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => router.push('/focus-room')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition hover:shadow-md ${
                focusMode.status === 'running'
                  ? 'bg-green-50 border border-green-300 text-green-800'
                  : 'bg-yellow-50 border border-yellow-300 text-yellow-800'
              }`}
              title="Quay lại Phòng tập trung"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  focusMode.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`}
              />
              {focusMode.status === 'running' ? '🔥' : '⏸'} {formatFocusTime(focusElapsed)}
            </motion.button>
          )}

          {/* Avatar */}
          <button
            ref={avatarRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md hover:border-blue-400 transition-all duration-200 focus:outline-none flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10"
            aria-label="Mở menu người dùng"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{fallbackIcon}</span>
            )}
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scaleY: 0.9, y: -10 }}
                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                exit={{ opacity: 0, scaleY: 0.9, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-6 top-16 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 origin-top"
              >
                {/* Thông tin người dùng */}
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-2xl">
                        {fallbackIcon}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-800 truncate">
                      {profile.username}
                    </p>
                    {equippedTitle && (
                      <p className="text-xs text-yellow-600 flex items-center gap-1 mt-0.5">
                        <span>{equippedTitle.icon}</span>
                        {equippedTitle.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Menu items */}
                <div className="p-1">
                  <Link
                    href="/focus-room"
                    onClick={handleMenuClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg">🧘</span>
                    <span>Phòng tập trung</span>
                  </Link>
                  <Link
                    href="/rewards"
                    onClick={handleMenuClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg">🎰</span>
                    <span>Phần thưởng</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleMenuClick();
                      setShowAlmanac(true);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                  >
                    <span className="text-lg">📖</span>
                    <span>Bộ sưu tập</span>
                  </button>

                  <Link
                    href="/settings"
                    onClick={handleMenuClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Cài đặt</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {showGacha && <GachaModal onClose={() => setShowGacha(false)} />}
      {showAlmanac && <AlmanacPopup onClose={() => setShowAlmanac(false)} />}
    </nav>
  );
}