//! TS-Типы данных для монет + категорий +лого и опций сортировки
export type CoinCategory = "DeFi" | "Layer1" | "Meme" | "Stablecoin";

export type CoinLogo = {
  id: number;
  name: string;
  url: string;
  mime: string;
  width?: number;
  height?: number;
};

export type Coin = {
  id: number;
  documentId: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  description: string;
  sparkline: number[];
  category: CoinCategory;
  logo: CoinLogo | null;
};

export type SortOption =
  | "price-desc"
  | "price-asc"
  | "change-desc"
  | "change-asc";
