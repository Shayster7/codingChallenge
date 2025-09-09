# Zeller Checkout System

This repository contains the implementation of a checkout system for a computer store, built with TypeScript. The system is designed to be flexible and easily extendable to accommodate new pricing rules and promotions.

## Features

- A `Checkout` class that can scan items and calculate a final price.
- A decoupled promotion engine that applies special offers to the cart.
- The initial set of promotions includes:
    - A "3 for 2" deal on Apple TVs.
    - A bulk discount on Super iPads, where the price drops to $499.99 each if more than 4 are purchased.

## Tech Stack

- **TypeScript**
- **Node.js**
- **Jest** for unit testing

## Project Structure

The project is organized into two main directories:

```
/
├── src/         # Contains all the core application source code
│   ├── Checkout.ts
│   ├── products.ts
│   ├── promotions.ts
│   └── types.ts
└── tests/       # Contains all the unit tests for the application
    ├── Checkout.test.ts
    └── promotions.test.ts
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Prerequisites

You must have [Node.js](https://nodejs.org/) and npm installed. 

### 2. Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd code-challenge-bff
   ```
3. Install the required npm packages:
   ```sh
   npm install
   ```

## Running the Tests

As this project is a library without a graphical or command-line interface, the primary way to verify its functionality is by running the included unit tests.

To run the test suite, execute the following command:

```sh
npm test
```

This will start the Jest test runner, which will execute all tests in the `tests/` directory and confirm that the checkout logic and promotions are working as expected.

## Usage Example

Here is a basic example of how to use the `Checkout` class within a TypeScript project:

```typescript
import { Checkout } from './src/Checkout';
import { BulkDiscountPromotion, XForYDealPromotion } from './src/promotions';
import { Promotion } from './src/types';

// 1. Define the promotions you want to apply
const pricingRules: Promotion[] = [
  new XForYDealPromotion('atv', 3, 2),
  new BulkDiscountPromotion('ipd', 4, 499.99),
];

// 2. Create a new Checkout instance with the rules
const co = new Checkout(pricingRules);

// 3. Scan items
co.scan('atv');
co.scan('atv');
co.scan('atv');
co.scan('vga');

// 4. Calculate the final total
const totalPrice = co.total(); // Expected: 249.00

console.log(`Total price: $${totalPrice.toFixed(2)}`);
```
