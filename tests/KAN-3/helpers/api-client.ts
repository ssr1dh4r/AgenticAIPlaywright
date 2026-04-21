/**
 * KAN-3: API Client Helper
 * Centralises token acquisition and authenticated request helpers.
 * Follows SOLID: Single Responsibility — this module only handles HTTP interaction.
 */

import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL, AUTH_CREDENTIALS } from '../fixtures/test-data';

export interface LoginResponse {
  token: string;
  message: string;
}

/**
 * Obtain a Bearer JWT token using valid credentials.
 * Retries up to 3 times to handle intermittent availability of the free-hosted API.
 */
export async function getAuthToken(request: APIRequestContext, retries = 3): Promise<string> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await request.post(`${API_BASE_URL}/api/Authenticate/Login`, {
        data: AUTH_CREDENTIALS.valid,
      });
      if (!response.ok()) {
        throw new Error(`Login returned HTTP ${response.status()}`);
      }
      const body: LoginResponse = await response.json();
      if (!body.token) {
        throw new Error('Login response missing token field');
      }
      return body.token;
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries) {
        // Brief pause before retry — API on free hosting can be briefly unavailable
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  throw new Error(`Failed to obtain auth token after ${retries} attempts: ${lastError?.message}`);
}

/**
 * Build the Authorization header object for authenticated requests.
 */
export function bearerHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
