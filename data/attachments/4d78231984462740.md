# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: KAN-3/auth.spec.ts >> AC1: Authentication >> TC-KAN3-AUTH-005 — Authenticated GET returns 200 and array of strings
- Location: tests/KAN-3/auth.spec.ts:88:7

# Error details

```
Error: Failed to obtain auth token after 3 attempts: Login returned HTTP 404
```

# Test source

```ts
  1  | /**
  2  |  * KAN-3: API Client Helper
  3  |  * Centralises token acquisition and authenticated request helpers.
  4  |  * Follows SOLID: Single Responsibility — this module only handles HTTP interaction.
  5  |  */
  6  | 
  7  | import { APIRequestContext } from '@playwright/test';
  8  | import { API_BASE_URL, AUTH_CREDENTIALS } from '../fixtures/test-data';
  9  | 
  10 | export interface LoginResponse {
  11 |   token: string;
  12 |   message: string;
  13 | }
  14 | 
  15 | /**
  16 |  * Obtain a Bearer JWT token using valid credentials.
  17 |  * Retries up to 3 times to handle intermittent availability of the free-hosted API.
  18 |  */
  19 | export async function getAuthToken(request: APIRequestContext, retries = 3): Promise<string> {
  20 |   let lastError: Error | undefined;
  21 |   for (let attempt = 1; attempt <= retries; attempt++) {
  22 |     try {
  23 |       const response = await request.post(`${API_BASE_URL}/api/Authenticate/Login`, {
  24 |         data: AUTH_CREDENTIALS.valid,
  25 |       });
  26 |       if (!response.ok()) {
  27 |         throw new Error(`Login returned HTTP ${response.status()}`);
  28 |       }
  29 |       const body: LoginResponse = await response.json();
  30 |       if (!body.token) {
  31 |         throw new Error('Login response missing token field');
  32 |       }
  33 |       return body.token;
  34 |     } catch (err) {
  35 |       lastError = err as Error;
  36 |       if (attempt < retries) {
  37 |         // Brief pause before retry — API on free hosting can be briefly unavailable
  38 |         await new Promise(resolve => setTimeout(resolve, 2000));
  39 |       }
  40 |     }
  41 |   }
> 42 |   throw new Error(`Failed to obtain auth token after ${retries} attempts: ${lastError?.message}`);
     |         ^ Error: Failed to obtain auth token after 3 attempts: Login returned HTTP 404
  43 | }
  44 | 
  45 | /**
  46 |  * Build the Authorization header object for authenticated requests.
  47 |  */
  48 | export function bearerHeaders(token: string): Record<string, string> {
  49 |   return { Authorization: `Bearer ${token}` };
  50 | }
  51 | 
```