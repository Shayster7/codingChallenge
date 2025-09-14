
import { CartItem, Promotion, SKU } from './types';

/**
 * A promotion that applies an 'X for Y' deal.
 */
export class XForYDealPromotion implements Promotion {
  constructor(private sku: SKU, private x: number, private y: number) {}

  apply(cartItems: CartItem[]): void {
    const item = cartItems.find(i => i.sku === this.sku); 

    if (item && item.quantity >= this.x) {
      const dealQuantity = Math.floor(item.quantity / this.x);
      const remainder = item.quantity % this.x;
      item.totalPrice = (dealQuantity * this.y * item.unitPrice) + (remainder * item.unitPrice);
    }
  }
}

/**
 * A promotion that applies a bulk discount.
 */
export class BulkDiscountPromotion implements Promotion {
  constructor(private sku: SKU, private threshold: number, private discountedPrice: number) {}

  apply(cartItems: CartItem[]): void {
    const item = cartItems.find(i => i.sku === this.sku);

    if (item && item.quantity > this.threshold) {
      item.totalPrice = item.quantity * this.discountedPrice;
    }
  }
}
