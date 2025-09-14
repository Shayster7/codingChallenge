
// Defines the valid SKUs for products
export type SKU = 'ipd' | 'mbp' | 'atv' | 'vga';

// Represents a product in the store catalogue
export interface Product {
  sku: SKU;
  name: string;
  price: number;
}

// Represents an item that has been added to the shopping cart
export interface CartItem {
  sku: SKU;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Interface for a promotion. Each promotion can inspect the cart and apply its rule.
export interface Promotion {
  apply(cartItems: CartItem[]): void;
}
