const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function normalizeBaseUrl(raw: string) {
  let url = raw.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }
  // remove trailing slashes
  return url.replace(/\/+$/g, '');
}

const BASE_URL = normalizeBaseUrl(rawBase);

function buildUrl(endpoint: string) {
  if (!endpoint.startsWith('/')) endpoint = '/' + endpoint;
  return `${BASE_URL}${endpoint}`;
}

async function handleUnauthorized(endpoint: string) {
  // For non-login endpoints, clear token and force login
  if (endpoint !== '/login') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export const apiGet = async (endpoint: string) => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Some backends expect a raw `token` header instead of Authorization Bearer
  if (token) {
    headers['token'] = token;
  }

  let response: Response;
  const requestUrl = buildUrl(endpoint);
  try {
    console.debug('[apiGet] Request:', requestUrl, { method: 'GET', headers });
    response = await fetch(requestUrl, {
      method: 'GET',
      headers,
    });
  } catch (err: any) {
    throw new Error(`Network error fetching ${requestUrl}: ${err?.message || 'Failed to fetch'}`);
  }

  if (response.status === 401 || response.status === 403) {
    await handleUnauthorized(endpoint);
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `API Error: ${response.statusText}`);
  }

  return response.json();
};

export const apiPost = async (endpoint: string, body: any) => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Some backends expect a raw `token` header instead of Authorization Bearer
  if (token) {
    headers['token'] = token;
  }

  let response: Response;
  const requestUrl = buildUrl(endpoint);
  try {
    console.debug('[apiPost] Request:', requestUrl, { method: 'POST', headers, body });
    response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    throw new Error(`Network error posting to ${requestUrl}: ${err?.message || 'Failed to fetch'}`);
  }

  if (response.status === 401 || response.status === 403) {
    await handleUnauthorized(endpoint);
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
};
