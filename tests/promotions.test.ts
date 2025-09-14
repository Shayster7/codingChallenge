import { BulkDiscountPromotion, XForYDealPromotion } from "../src/promotions";
import { CartItem } from "../src/types";

describe("XForYDealPromotion", () => {
  const deal = new XForYDealPromotion("atv", 3, 2);
  const unitPrice = 109.5;

  it("should not apply deal if quantity is less than X", () => {
    const cart: CartItem[] = [
      { sku: "atv", quantity: 2, unitPrice, totalPrice: 2 * unitPrice },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(2 * unitPrice);
  });

  it("should apply deal for exactly X items", () => {
    const cart: CartItem[] = [
      { sku: "atv", quantity: 3, unitPrice, totalPrice: 3 * unitPrice },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(2 * unitPrice);
  });

  it("should apply deal multiple times for multiples of X", () => {
    const cart: CartItem[] = [
      { sku: "atv", quantity: 6, unitPrice, totalPrice: 6 * unitPrice },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(4 * unitPrice);
  });

  it("should apply deal and handle remainder", () => {
    const cart: CartItem[] = [
      { sku: "atv", quantity: 7, unitPrice, totalPrice: 7 * unitPrice },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(4 * unitPrice + 1 * unitPrice);
  });
});

describe("BulkDiscountPromotion", () => {
  const deal = new BulkDiscountPromotion("ipd", 4, 499.99);
  const unitPrice = 549.99;

  it("should not apply discount if quantity is at the threshold", () => {
    const cart: CartItem[] = [
      { sku: "ipd", quantity: 4, unitPrice, totalPrice: 4 * unitPrice },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(4 * unitPrice);
  });

  it("should apply discount if quantity is over the threshold", () => {
    const cart: CartItem[] = [
      { sku: "ipd", quantity: 5, unitPrice, totalPrice: 5 * unitPrice },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(5 * 499.99);
  });

  it("should not apply discount for other products", () => {
    const cart: CartItem[] = [
      { sku: "atv", quantity: 5, unitPrice: 109.5, totalPrice: 5 * 109.5 },
    ];
    deal.apply(cart);
    expect(cart[0].totalPrice).toBe(5 * 109.5);
  });
});
