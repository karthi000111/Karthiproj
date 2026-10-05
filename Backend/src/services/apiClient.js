import {Platform} from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? {'Content-Type': 'application/json'} : {}),
    ...(authToken ? {Authorization: `Bearer ${authToken}`} : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {...options, headers});
  } catch (error) {
    throw new Error('Cannot reach the Note2Flash server. Make sure the backend is running.');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || 'The server could not complete this request.');
    error.status = response.status;
    throw error;
  }
  return payload;
}