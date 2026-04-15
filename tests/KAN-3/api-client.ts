import { APIRequestContext, APIResponse, expect } from '@playwright/test';

const BASE_URL = 'http://eaapi.somee.com';

type Headers = Record<string, string>;

export async function loginAndGetToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${BASE_URL}/api/Authenticate/Login`, {
    data: { userName: 'Karthik', password: '123456' },
  });

  expect(res.ok(), `Login should succeed. Status: ${res.status()}`).toBeTruthy();
  const body = await safeJson(res);

  if (typeof body === 'string') {
    return body;
  }
  if (Array.isArray(body) && typeof body[0] === 'string') {
    return body[0];
  }
  if (body && typeof body.token === 'string') {
    return body.token;
  }

  throw new Error(`Unable to derive token from login response: ${JSON.stringify(body)}`);
}

export function authHeaders(token: string): Headers {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function safeJson(res: APIResponse): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiGet(
  request: APIRequestContext,
  path: string,
  headers?: Headers,
): Promise<APIResponse> {
  return request.get(`${BASE_URL}${path}`, { headers });
}

export async function apiPost(
  request: APIRequestContext,
  path: string,
  data: unknown,
  headers?: Headers,
): Promise<APIResponse> {
  return request.post(`${BASE_URL}${path}`, { data, headers });
}
