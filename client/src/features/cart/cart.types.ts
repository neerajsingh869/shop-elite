export interface CartItem {
  productId: number;
  title: string;
  quantity: number;
  price: number;
  brand?: string;
  thumbnail: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
