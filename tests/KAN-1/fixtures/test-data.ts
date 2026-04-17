export const TEST_USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
} as const;

export const TEST_DATA = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  alternateUser: {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '90210',
  },
} as const;

export const PRODUCTS = {
  backpack: {
    name: 'Sauce Labs Backpack',
    slug: 'sauce-labs-backpack',
    price: 29.99,
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    slug: 'sauce-labs-bike-light',
    price: 9.99,
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    slug: 'sauce-labs-bolt-t-shirt',
    price: 15.99,
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    slug: 'sauce-labs-fleece-jacket',
    price: 49.99,
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    slug: 'sauce-labs-onesie',
    price: 7.99,
  },
  tShirtRed: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    slug: 'test.allthethings()-t-shirt-(red)',
    price: 15.99,
  },
} as const;

export const EXPECTED = {
  paymentInfo: 'SauceCard #31337',
  shippingInfo: 'Free Pony Express Delivery!',
  confirmationHeader: 'Thank you for your order!',
  confirmationBody:
    'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
  errors: {
    firstNameRequired: 'Error: First Name is required',
    lastNameRequired: 'Error: Last Name is required',
    postalCodeRequired: 'Error: Postal Code is required',
  },
} as const;

export const URLS = {
  base: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutInfo: '/checkout-step-one.html',
  checkoutOverview: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
} as const;
