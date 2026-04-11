/**
 * Test Configuration and Constants for KAN-3 API Endpoint Validation Tests
 * API Base URL: http://eaapi.somee.com/api
 */

export const API_ENDPOINTS = {
  LOGIN: '/Authenticate/Login',
  GET_AUTH: '/Authenticate/Get',
  CREATE_PRODUCT: '/Product/Create',
  GET_PRODUCTS: '/Product/GetProducts',
  GET_PRODUCT_BY_ID: '/Product/GetProductById',
  GET_PRODUCT_BY_NAME: '/Product/GetProductByName',
  GET_PRODUCT_BY_ID_AND_NAME: '/Product/GetProductByIdAndName',
  POST_PRODUCT: '/Product',
  CREATE_COMPONENT: '/Components/CreateComponent',
  GET_ALL_COMPONENTS: '/Components/GetAllComponents',
  GET_COMPONENTS_BY_PRODUCT_ID: '/Components/GetComponentsByProductId',
  GET_COMPONENT_BY_PRODUCT_ID: '/Components/GetComponentByProductId',
};

export const API_CONFIG = {
  BASE_URL: 'http://eaapi.somee.com/api',
  SWAGGER_URL: 'http://eaapi.somee.com/swagger/index.html',
  DEFAULT_TIMEOUT: 30000,
  REQUEST_TIMEOUT: 30000,
};

export const DEFAULT_CREDENTIALS = {
  username: 'Karthik',
  password: '123456',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
};

export const VALID_PAYLOADS = {
  VALID_LOGIN: {
    username: 'Karthik',
    password: '123456',
  },
  VALID_PRODUCT: (timestamp?: number) => ({
    name: `TestProduct_${timestamp || Date.now()}`,
    type: 1,
    description: 'Test product created by automation',
  }),
  VALID_COMPONENT: (timestamp?: number) => ({
    productId: 1,
    name: `TestComponent_${timestamp || Date.now()}`,
    description: 'Test component created by automation',
  }),
};