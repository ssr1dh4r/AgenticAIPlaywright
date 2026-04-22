// KAN-4: API Test Fixtures & Shared Data
// Base URL and common test data for restful-api.dev

export const BASE_URL = 'https://api.restful-api.dev';

export const SEEDED_OBJECTS = {
  id7: {
    id: '7',
    name: 'Apple MacBook Pro 16',
    data: {
      year: 2019,
      price: 1849.99,
      'CPU model': 'Intel Core i9',
      'Hard disk size': '1 TB',
    },
  },
};

export const createObjectPayload = (suffix: string) => ({
  name: `KAN4 Test Object ${suffix}`,
  data: {
    year: 2024,
    price: 999.99,
    testTag: 'kan4-automation',
  },
});

export const createMinimalPayload = (suffix: string) => ({
  name: `KAN4 Minimal ${suffix}`,
});
