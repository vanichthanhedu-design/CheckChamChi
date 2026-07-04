'use client';

interface Props {
  username: string;
  equippedTitle?: { icon: string; name: string } | null;
}

export default function GreetingCard({ username, equippedTitle }: Props) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const dateStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 flex flex-col justify-center h-full text-center">
      {equippedTitle && (
        <div className="text-sm font-semibold text-yellow-600 mb-1">
          {equippedTitle.icon} {equippedTitle.name}
        </div>
      )}
      <h2 className="text-xl font-bold text-gray-800">
        {getGreeting()}, {username}!
      </h2>
      <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
    </div>
  );
}