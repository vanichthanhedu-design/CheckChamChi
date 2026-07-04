export interface TreeTitleDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  minLevel: number;
  maxLevel: number;
}

export const TREE_TITLE_LIST: TreeTitleDef[] = [
  {
    id: 'tree_hat_mam',
    name: 'Hạt Mầm Tò Mò',
    description: 'Cây nhỏ mới nhú, đang ngơ ngác nhìn thế giới tri thức.',
    icon: '🌱',
    minLevel: 1,
    maxLevel: 5,
  },
  {
    id: 'tree_mam_xanh',
    name: 'Mầm Xanh Vươn Vai',
    description: 'Cây bắt đầu ra lá, hấp thụ "vitamin bài tập" mỗi ngày.',
    icon: '🌿',
    minLevel: 6,
    maxLevel: 15,
  },
  {
    id: 'tree_co_thu',
    name: 'Cổ Thụ Tri Thức',
    description: 'Thân cây đã vững chãi, che bóng mát cho những chuỗi ngày cày cuốc.',
    icon: '🌳',
    minLevel: 16,
    maxLevel: 30,
  },
  {
    id: 'tree_dai_thu',
    name: 'Đại Thụ Nở Hoa',
    description: 'Sự kiên trì đã kết trái ngọt, hoa học vấn bắt đầu tỏa hương.',
    icon: '🌸',
    minLevel: 31,
    maxLevel: 50,
  },
  {
    id: 'tree_than_moc',
    name: 'Thần Mộc Vô Cực',
    description: 'Đẳng cấp tối cao của sự tập trung, cây đã hóa thành huyền thoại.',
    icon: '✨',
    minLevel: 51,
    maxLevel: Infinity,
  },
];

export function getTreeTitleForLevel(level: number): TreeTitleDef | null {
  return TREE_TITLE_LIST.find((t) => level >= t.minLevel && level <= t.maxLevel) || null;
}