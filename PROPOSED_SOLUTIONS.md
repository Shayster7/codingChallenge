# Checkout System Design Proposal

This document outlines the specification for the checkout system and proposes several potential solutions for implementation, focusing on the design of a flexible pricing rule system.

## 1. Specification Summary

The goal is to build a checkout system in TypeScript that calculates the total price for a list of scanned items.

### Products

| SKU | Name | Unit Price |
| :--- | :--- | :--- |
| `ipd` | Super iPad | $549.99 |
| `mbp` | MacBook Pro | $1399.99 |
| `atv` | Apple TV | $109.50 |
| `vga` | VGA adapter | $30.00 |

### Special Offers

1.  **3-for-2 on Apple TVs**: Buying three Apple TVs costs the same as buying two.
2.  **Bulk Discount on Super iPads**: If more than four Super iPads are purchased, the price for each iPad drops to $499.99.

### Core Requirements

-   **Flexibility**: The system for applying pricing rules must be flexible and easy to modify.
-   **Interface**: The system will be used via a class with the following interface:
    ```typescript
    const co = new Checkout(pricingRules);
    co.scan(item);
    co.total();
    ```
-   **Technology**: The implementation must be in TypeScript, without external frameworks or GUI/CLI components. Unit tests are required.

## 2. Design Challenge: Flexible Pricing Rules

The main design challenge is creating a `pricingRules` structure that is powerful enough to represent the current deals and flexible enough to accommodate future, potentially more complex, promotions with minimal code changes.

Below are three proposed solutions, ordered from simplest to most flexible.

---

## Solution 1: Simple Rule Functions

### Concept

This approach defines the `pricingRules` as a simple map where the key is the product `SKU` and the value is a function. This function takes the item quantity and base price as input and returns the calculated total price for that line item.

### Structure

The `pricingRules` object would look like this:

```typescript
// pricingRules: Map<SKU, (quantity: number, price: number) => number>

const pricingRules = new Map();

// Rule for 'atv'
pricingRules.set('atv', (quantity, price) => {
  const dealQuantity = Math.floor(quantity / 3);
  const remainder = quantity % 3;
  return (dealQuantity * 2 * price) + (remainder * price);
});

// Rule for 'ipd'
pricingRules.set('ipd', (quantity, price) => {
  const newPrice = quantity > 4 ? 499.99 : price;
  return quantity * newPrice;
});
```

The `Checkout.total()` method would group scanned items by SKU, and for each SKU, check if a rule exists in the map. If a rule is found, it's used to calculate the price; otherwise, a default calculation (`quantity * price`) is performed.

### Pros & Cons

-   **Pros**:
    -   Very simple to implement and understand.
    -   Directly satisfies the current requirements.
    -   Adding or changing rules for a specific item is trivial.
-   **Cons**:
    -   Limited flexibility. It cannot handle promotions that involve multiple different items (e.g., "buy a MacBook Pro, get a free VGA adapter").
    -   Rule logic is coupled to the checkout process.

---

## Solution 2: Strategy Pattern

### Concept

This is a more formal, object-oriented version of Solution 1. We define a `PricingStrategy` interface and create concrete classes that encapsulate the logic for each type of deal. The `pricingRules` object would map a SKU to an instance of a strategy class.

### Structure

```typescript
interface PricingStrategy {
  calculateTotal(quantity: number, price: number): number;
}

class XforYDeal implements PricingStrategy {
  constructor(private x: number, private y: number) {}

  calculateTotal(quantity: number, price: number): number {
    const dealQuantity = Math.floor(quantity / this.x);
    const remainder = quantity % this.x;
    return (dealQuantity * this.y * price) + (remainder * price);
  }
}

class BulkDiscount implements PricingStrategy {
  constructor(private threshold: number, private discountedPrice: number) {}

  calculateTotal(quantity: number, price: number): number {
    const newPrice = quantity > this.threshold ? this.discountedPrice : price;
    return quantity * newPrice;
  }
}

// pricingRules: Map<SKU, PricingStrategy>
const pricingRules = new Map();
pricingRules.set('atv', new XforYDeal(3, 2));
pricingRules.set('ipd', new BulkDiscount(4, 499.99));
```

### Pros & Cons

-   **Pros**:
    -   Cleanly encapsulates pricing logic into distinct, reusable classes.
    -   Follows solid object-oriented design principles (Strategy Pattern).
    -   Strategies can be configured (e.g., `XforYDeal(3, 2)`, `XforYDeal(5, 3)`), making them reusable for future promotions.
-   **Cons**:
    -   Requires more boilerplate code than Solution 1.
    -   Like Solution 1, it is primarily designed for rules that apply to a single SKU and does not easily support multi-item deals.

---

## Solution 3: Decoupled Promotion Engine

### Concept

This is the most flexible and scalable solution. It treats promotions as a pipeline of transformations that are applied to the entire shopping cart. The `Checkout` class is only responsible for holding the items and summing the final prices after all promotions have run.

A `Promotion` is an object that can inspect the entire cart and apply a discount or price adjustment.

### Structure

1.  The `Checkout.total()` method first creates a summary of the cart (e.g., an array of `{sku, quantity, price, total}` objects).
2.  It then passes this cart summary through a list of `Promotion` objects.
3.  Each promotion can modify the cart summary. For example, by changing a line item's total or adding a new line item representing a discount.

```typescript
interface CartItem {
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // This is what promotions will modify
}

interface Promotion {
  apply(cartItems: CartItem[]): void;
}

class BulkDiscountPromotion implements Promotion {
  // ... constructor ...
  apply(cartItems: CartItem[]): void {
    const item = cartItems.find(i => i.sku === this.sku);
    if (item && item.quantity > this.threshold) {
      item.totalPrice = item.quantity * this.discountedPrice;
    }
  }
}

class XForYDealPromotion implements Promotion {
  // ... constructor ...
  apply(cartItems: CartItem[]): void {
    const item = cartItems.find(i => i.sku === this.sku);
    if (item) {
        const dealQuantity = Math.floor(item.quantity / this.x);
        const remainder = item.quantity % this.x;
        item.totalPrice = (dealQuantity * this.y * item.unitPrice) + (remainder * item.unitPrice);
    }
  }
}

// The pricingRules would be an array of promotion instances
const pricingRules: Promotion[] = [
  new BulkDiscountPromotion('ipd', 4, 499.99),
  new XForYDealPromotion('atv', 3, 2),
];
```

After applying all promotions, the `total()` method simply sums the `totalPrice` of every item in the cart.

### Pros & Cons

-   **Pros**:
    -   **Extremely Flexible**: This design can handle a wide variety of promotions, including complex multi-item deals (e.g., "buy X and Y, get Z free"), as each promotion has access to the entire cart.
    -   **Decoupled**: Promotion logic is completely separate from the `Checkout` class, which only needs to manage the promotion pipeline and sum the final result.
-   **Cons**:
    -   More complex to implement initially.
    -   The order in which promotions are applied could matter, which may require a priority system for promotions if they can interact with each other.

## 3. Recommendation

For the stated goal of making the pricing rules "as flexible as possible", **Solution 3 (Decoupled Promotion Engine) is the recommended approach.**

While it is slightly more complex upfront, it provides a robust foundation that can easily accommodate new and more intricate pricing rules in the future without requiring changes to the core checkout logic. This best aligns with the requirement for a system that can change with little notice.
