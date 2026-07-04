export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface ShopPet {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  imageUrl: string;
  price: number;
}

export interface ShopTitle {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  icon: string;
  price: number;
}