import { Checkout } from "../src/checkout";
import { BulkDiscountPromotion, XForYDealPromotion } from "../src/promotions";
import { Promotion } from "../src/types";

// Set up the promotions
const promotions: Promotion[] = [
  new XForYDealPromotion("atv", 3, 2),
  new BulkDiscountPromotion("ipd", 4, 499.99),
];

describe("Checkout", () => {
  let co: Checkout;

  beforeEach(() => {
    co = new Checkout(promotions);
  });

  it("should return 0 for an empty cart", () => {
    expect(co.total()).toBe(0);
  });

  // Add items to cart
  it("should calculate total for items with no special offers", () => {
    co.scan("mbp");
    co.scan("vga");
    expect(co.total()).toBe(1399.99 + 30.0);
  });

  // Test scenarios from README
  test("Scenario 1: atv, atv, atv, vga -> Total: $249.00", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("vga");
    // 2 * 109.50 (for 3 atv) + 30.00 (for 1 vga)
    expect(co.total()).toBe(249.0);
  });

  test("Scenario 2: atv, ipd, ipd, atv, ipd, ipd, ipd -> Total: $2718.95", () => {
    co.scan("atv");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("atv");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    // 2 * 109.50 (for 2 atv) + 5 * 499.99 (for 5 ipd)
    expect(co.total()).toBe(219 + 2499.95);
  });

  // Additional tests
  test("Bulk iPad discount should not apply for 4 iPads", () => {
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    expect(co.total()).toBe(4 * 549.99);
  });

  test("Apple TV deal should apply correctly for 4 TVs", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    // 3 for 2 deal + 1 full price
    expect(co.total()).toBe(3 * 109.5);
  });
});
