# Zeller Checkout System

This repository contains the implementation of a checkout system for a computer store, built with TypeScript.

## User stories

As a Customer:

- I want to receive a "3 for 2" discount on Apple TVs, so that when I buy three, I only pay for two.
- I want the price of Super iPads to drop to $499.99 each if I buy more than four, so I can get a bulk discount.

As a Cashier:

- I want to scan items in any order and have the system correctly calculate the total.
- I want the system to automatically apply the current promotional deals to the final price.

As a Sales Manager:

- I want the pricing and promotional rules to be flexible and easy to update, so I can change specials with little notice without needing a developer to rewrite the system.

## Running the Tests

To run the test suite, install the project dependencies and execute the following command:

```sh
npm test
```