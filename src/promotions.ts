
import { CartItem, Promotion, SKU } from './types';

/**
 * A promotion that applies an 'X for Y' deal.
 * e.g., 3 for 2, where x=3 and y=2.
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
 * e.g., price drops to a new price if quantity is over a certain threshold.
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
