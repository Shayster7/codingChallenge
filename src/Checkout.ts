
import { products } from './products';
import { CartItem, Promotion, SKU } from './types';

export class Checkout {
  private scannedItems: Map<SKU, number> = new Map();

  constructor(private promotions: Promotion[]) {}

  /**
   * Scans an item and adds it to the cart.
   * @param sku The SKU of the item to scan.
   */
  scan(sku: SKU): void {
    const currentQuantity = this.scannedItems.get(sku) || 0;
    this.scannedItems.set(sku, currentQuantity + 1);
  }

  /**
   * Calculates the total price of all scanned items after applying promotions.
   * @returns The final total price.
   */
  total(): number {
    // 1. Create the initial cart state from scanned items
    const cartItems: CartItem[] = [];
    for (const [sku, quantity] of this.scannedItems.entries()) {
      const product = products.get(sku);
      if (product) {
        cartItems.push({
          sku,
          quantity,
          unitPrice: product.price,
          totalPrice: quantity * product.price, // Start with the undiscounted total
        });
      }
    }

    // 2. Apply all promotions to the cart
    for (const promotion of this.promotions) {
      promotion.apply(cartItems);
    }

    // 3. Sum the final total prices of all items in the cart
    const finalTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    
    return parseFloat(finalTotal.toFixed(2));
  }
}
