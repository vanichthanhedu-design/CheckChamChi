'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsView() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  const [username, setUsername] = useState(profile.username);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [primaryColor, setPrimaryColor] = useState(profile.primaryColor);
  const [theme, setTheme] = useState(profile.theme);

  const focusMode = useAppStore((state) => state.focusMode);
  const setFocusBackground = useAppStore((state) => state.setFocusBackground);
  const setFocusTarget = useAppStore((state) => state.setFocusTarget);

  const [focusBgUrl, setFocusBgUrl] = useState(focusMode.backgroundUrl);
  const [focusTargetMinutes, setFocusTargetMinutes] = useState(Math.floor(focusMode.targetSeconds / 60));

  useEffect(() => {
    setUsername(profile.username);
    setAvatar(profile.avatar);
    setPrimaryColor(profile.primaryColor);
    setTheme(profile.theme);
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      username: username.trim() || 'Người Chăm Chỉ',
      avatar: avatar.trim(),
      primaryColor,
      theme,
    });
    // Đồng bộ theme với DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Xuất dữ liệu
  const handleExport = () => {
    const state = useAppStore.getState();
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `check-cham-chi-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Nhập dữ liệu
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        useAppStore.setState(data);
        alert('Dữ liệu đã được khôi phục thành công!');
      } catch (err) {
        alert('File không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">⚙️ Cài đặt cá nhân</h1>

      {/* 1. Hồ sơ */}
      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
        <h2 className="text-xl font-semibold">👤 Hồ sơ</h2>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl overflow-hidden border-2"
            style={{ borderColor: primaryColor }}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>🙂</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên hiển thị</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">URL Avatar (tùy chọn)</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Dán link ảnh đại diện"
          />
        </div>
      </div>

      {/* 2. Màu chủ đạo */}
      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
        <h2 className="text-xl font-semibold">🎨 Màu chủ đạo</h2>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-16 h-16 rounded-xl border cursor-pointer"
          />
          <span className="text-sm text-gray-500">{primaryColor}</span>
        </div>
        <div
          className="p-4 rounded-xl text-white font-semibold"
          style={{ backgroundColor: primaryColor }}
        >
          Đây là màu bạn đã chọn
        </div>
      </div>

      {/* 3. Sao lưu & Khôi phục */}
      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
        <h2 className="text-xl font-semibold">💾 Sao lưu & Khôi phục</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleExport}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            📥 Xuất dữ liệu
          </button>
          <label className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer">
            📤 Nhập dữ liệu
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        <p className="text-xs text-gray-400">
          Xuất file JSON để sao lưu. Nhập file đã sao lưu để khôi phục.
        </p>
      </div>

      {/* 4. Phòng tập trung */}
      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
        <h2 className="text-xl font-semibold">🧘 Phòng tập trung</h2>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Hình nền (URL)</label>
          <input
            type="text"
            value={focusBgUrl}
            onChange={(e) => setFocusBgUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Dán URL ảnh (tùy chọn)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Thời gian mục tiêu (phút, 0 = không giới hạn)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={focusTargetMinutes}
            onChange={(e) => setFocusTargetMinutes(Number(e.target.value))}
            className="w-32 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          onClick={() => {
            setFocusBackground(focusBgUrl);
            setFocusTarget(focusTargetMinutes * 60);
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Lưu cấu hình Focus
        </button>
      </div>

      {/* Nút Lưu cài đặt */}
      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl font-bold text-white shadow-lg transition hover:opacity-90"
        style={{ backgroundColor: primaryColor }}
      >
        Lưu cài đặt
      </button>
    </div>
  );
}