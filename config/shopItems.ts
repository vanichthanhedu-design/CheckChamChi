import type { ShopPet, ShopTitle } from './types';
import { getRarityStyle } from '@/config/rarity';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

// ============================================
// DỮ LIỆU PET
// ============================================

export const SHOP_PETS: ShopPet[] = [
  {
    id: 'pet_01',
    name: 'Mèo Con Chăm Chỉ',
    description: 'Một chú mèo nhỏ luôn bên bạn khi học bài.',
    rarity: 'Common',
    imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmRzZGpzejMxZmxiZTBpeGVmbTAzNnQ4enJ0OGlpOHowM2doNDN3MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L5yRgmTEWQtA5lkI8a/giphy.gif', // Bạn tự dán link ảnh
    price: 50,
  },
  
  {
    id: 'pet_02',
    name: 'Chó Con Trung Thành',
    description: 'Một chú chó nhỏ luôn bên bạn khi học bài.',
    rarity: 'Common',
    imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2o2ZHNxajIwOXUxMXFxaGx2ZjY2cDJlZ3R4emtjb3BqMDVndGtwNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UE9h56TkOIcsLDasDn/giphy.gif', // Bạn tự dán link ảnh
    price: 50,
  },    
  
  {
    id: 'pet_03',
    name: 'Thỏ Trắng Ngoan Ngoãn',
    description: 'Nhảy nhót quanh bàn học, nhắc bạn nghỉ ngơi.',
    rarity: 'Rare',
    imageUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjlrdDVlNjlzaGx3ejR0ZDZueHl5b3FmZG1weGE4MG41b2EzZTIyMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zpYfNEjFEaXtrNT48P/giphy.gif',
    price: 100,
  },
  {
    id: 'pet_04',
    name: 'Cú Mèo Thông Thái',
    description: 'Thức khuya cùng bạn, đôi mắt sáng ngời tri thức.',
    rarity: 'Rare',
    imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3F3cnl5bXZ6Zjk1NWFjYmhtMm9lYmFvYnZmMndvZTV1bmVwNnh4ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CP3Oe5uMo60r1nAEBV/giphy.gif',
    price: 100,
  },
  {
    id: 'pet_05',
    name: 'Cáo Nhỏ Lanh Lợi',
    description: 'Khéo léo và nhanh trí, giúp bạn giải bài tập khó.',
    rarity: 'Rare',
    imageUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWNpeWdodGx1ejZzbDhocHY1M21kejl4NGd4dWpoZ2RhanJ6Yjl3dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UrK6ZxHoeOTPawzy4q/giphy.gif',
    price: 100,
  },
  {
    id: 'pet_06',
    name: 'Gấu Trúc Thư Thái',
    description: 'Chậm rãi nhưng đầy kiên nhẫn, như việc học mỗi ngày.',
    rarity: 'Epic',
    imageUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2NpNGxrbHBqY251cmZpa201b2h6Nm5yeTdibW01MWU2eGQ0YzdhayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2Ur2YX6KH3AA0xuoWm/giphy.gif',
    price: 500,
  },
  {
    id: 'pet_07',
    name: 'Khỉ Con Nhanh Nhẹn',
    description: 'Đuổi theo Deadline như một vận động viên.',
    rarity: 'Epic',
    imageUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGhxZXFkemh0aGZ4OTd5cm5kdjI1bTAzNWpjYjMxMnp0d2JoY2MxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cacXmcTm3unSoNo2KT/giphy.gif',
    price: 500,
  },
  {
    id: 'pet_08',
    name: 'Kỳ Lân Cầu Vồng',
    description: 'Sự kiên trì của bạn đã triệu hồi sinh vật huyền thoại này.',
    rarity: 'Legendary',
    imageUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbG8yN3VqMW95MXFraW43YnZmbDhlOGk1eGpocXd2cGg5ajZtNzl5YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xmzHCGDcofRbW/giphy.gif',
    price: 1000,
  },
  {
    id: 'pet_09',
    name: 'Phượng Hoàng Lửa',
    description: 'Vươn lên từ thử thách, rực rỡ như thành tích của bạn.',
    rarity: 'Legendary',
    imageUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjhyZ2ZyZGFyZXJ1bW00Nms1cmIxMG5jZDlyaWIweWF5YzZkN292eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aRQNBmC2Ga7wd9jHEK/giphy.gif',
    price: 1000,
  },
  {
    id: 'pet_10',
    name: 'Mèo Thần Tài',
    description: 'Vẫy tay gọi may mắn trong mỗi kỳ thi.',
    rarity: 'Legendary',
    imageUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmpsbHc4ejF3ejR0M3dudDliOTNoMGtvc3hndnp1N2JmZWZuNmZheiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZD8WrbbHJYdM0pFOIH/giphy.gif',
    price: 1000,
  },
];

// ============================================
// DỮ LIỆU TITLE (10 danh hiệu)
// ============================================

export const SHOP_TITLES: ShopTitle[] = [
  {
    id: 'title_01',
    name: 'Người Học Chăm Chỉ',
    description: 'Dành cho những ai luôn hoàn thành nhiệm vụ mỗi ngày.',
    rarity: 'Common',
    icon: '📚',
    price: 30,
  },
  {
    id: 'title_02',
    name: 'Chim Sâu Dậy Sớm',
    description: 'Bắt đầu ngày mới đầy năng lượng.',
    rarity: 'Common',
    icon: '🐦',
    price: 30,
  },
  {
    id: 'title_03',
    name: 'Cú Đêm Chính Hiệu',
    description: 'Học suốt đêm không biết mệt.',
    rarity: 'Common',
    icon: '🦉',
    price: 30,
  },
  {
    id: 'title_04',
    name: 'Công Nhân Cày Cuốc',
    description: 'Không ngừng nghỉ, không bỏ cuộc.',
    rarity: 'Rare',
    icon: '⚙️',
    price: 60,
  },
  {
    id: 'title_05',
    name: 'CEO Deadline',
    description: 'Quản lý thời gian như một vị giám đốc thực thụ.',
    rarity: 'Rare',
    icon: '💼',
    price: 60,
  },
  {
    id: 'title_06',
    name: 'Bậc Thầy Revision',
    description: 'Ôn tập là chìa khóa thành công.',
    rarity: 'Epic',
    icon: '🧠',
    price: 120,
  },
  {
    id: 'title_07',
    name: 'Hủy Diệt Trì Hoãn',
    description: 'Không còn chỗ cho sự lười biếng.',
    rarity: 'Epic',
    icon: '⚡',
    price: 120,
  },
  {
    id: 'title_08',
    name: 'Huyền Thoại Sống',
    description: 'Cảm hứng cho mọi người xung quanh.',
    rarity: 'Legendary',
    icon: '👑',
    price: 250,
  },
  {
    id: 'title_09',
    name: 'Hiền Triết Tri Thức',
    description: 'Uyên thâm, sâu sắc, đáng kính.',
    rarity: 'Legendary',
    icon: '🔮',
    price: 250,
  },
  {
    id: 'title_10',
    name: 'Nhà Thám Hiểm Kiến Thức',
    description: 'Luôn tò mò và khám phá những điều mới.',
    rarity: 'Rare',
    icon: '🗺️',
    price: 60,
  },
];
