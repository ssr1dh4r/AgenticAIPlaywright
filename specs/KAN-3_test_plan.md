# KAN-3 EA API Endpoints Validation Test Plan

## Application Overview

Comprehensive test plan for validating EA API endpoints including authentication, components, and product management functionality.

## Test Scenarios

### 1. Authentication Endpoints Tests

#### 1.1. Generate Token - Happy Path
- POST /api/Authenticate/Login with userName: 'Karthik', password: '123456'
- Expect 200, valid token in response

#### 1.2. Generate Token - Missing Required Fields
- POST with empty userName/password → 400/401/422

#### 1.3. Get Authentication Details - Valid Token
- GET /api/Authenticate/Get with Bearer token → 200

### 2. Components Endpoints Tests

#### 2.1. Get All Components - Happy Path
- GET /Components/GetAllComponents with auth → 200, array with id/name

#### 2.2. Get Component By Product ID - Invalid ID
- GET /Components/GetComponentByProductId/999999 → 200/204/400/404

### 3. Product Endpoints Tests

#### 3.1. Get All Products
- GET /Product/GetProducts with auth → 200, collection

#### 3.2. Get Product By ID - Invalid
- GET /Product/GetProductById/999999 → 200/204/400/404
