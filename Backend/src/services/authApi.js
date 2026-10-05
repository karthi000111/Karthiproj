import {apiRequest} from './apiClient';

export function registerAccount(details) {
  return apiRequest('/auth/register', {method: 'POST', body: JSON.stringify(details)});
}

export function loginAccount(credentials) {
  return apiRequest('/auth/login', {method: 'POST', body: JSON.stringify(credentials)});
}

export function getCurrentUser() {
  return apiRequest('/auth/me');
}

export function logoutAccount() {
  return apiRequest('/auth/logout', {method: 'POST'});
}

export function updateAccount(details) {
  return apiRequest('/auth/me', {method: 'PUT', body: JSON.stringify(details)});
}