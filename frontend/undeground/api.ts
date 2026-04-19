import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000'
  : 'http://localhost:8000';

// Хелпер-функции для работы с хранилищем
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};

const parseResponseError = async (response: Response, defaultMessage: string): Promise<string> => {
  const text = await response.text();
  if (!text) return defaultMessage;
  try {
    const body = JSON.parse(text);
    return body.detail || body.message || text;
  } catch {
    return text;
  }
};

// Helper для получения токена
async function getAuthToken(): Promise<string | null> {
  try {
    return await storage.getItem('authToken');
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
}

// Helper для выполнения запросов с автоматическим добавлением токена
async function makeRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Если ответ 401 - токен истек или невалиден
    if (response.status === 401) {
      await storage.removeItem('authToken');
      await storage.removeItem('userData');
      // Здесь можно добавить логику перенаправления на Login
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API Client методы
export const apiClient = {
  // ===== Auth Endpoints =====

  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) {
    const response = await makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorMessage = await parseResponseError(response, 'Registration failed');
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  async login(email: string, password: string) {
    const response = await makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorMessage = await parseResponseError(response, 'Login failed');
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  async getCurrentUser() {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await makeRequest('/me?token=' + token, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  },

  // ===== Home Data Endpoints =====

  async getHomeData() {
    const response = await makeRequest('/home', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }

    return await response.json();
  },

  // ===== Shop Endpoints =====

  async createShop(shopData: any) {
    const response = await makeRequest('/shops', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });

    if (!response.ok) {
      throw new Error('Failed to create shop');
    }

    return await response.json();
  },

  // ===== Generic Methods for Future Use =====

  async get(endpoint: string) {
    const response = await makeRequest(endpoint, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`GET request failed: ${endpoint}`);
    }

    return await response.json();
  },

  async post(endpoint: string, body: any) {
    const response = await makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `POST request failed: ${endpoint}`);
    }

    return await response.json();
  },

  async put(endpoint: string, body: any) {
    const response = await makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PUT request failed: ${endpoint}`);
    }

    return await response.json();
  },

  async delete(endpoint: string) {
    const response = await makeRequest(endpoint, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed: ${endpoint}`);
    }

    return response.ok;
  },
};
