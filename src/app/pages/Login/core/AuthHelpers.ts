/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';
import { AuthModel } from './_models';

// Đặt key rõ ràng, tránh trùng tên với API browser
const AUTH_STORAGE_KEY = 'authData';

// === Storage helper: chọn dùng localStorage hoặc sessionStorage ===
const storage = localStorage; // 👉 đổi thành sessionStorage nếu muốn lưu theo phiên

const getAuth = (): AuthModel | null => {
  const value = storage.getItem(AUTH_STORAGE_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthModel;
  } catch (error) {
    console.error('AUTH STORAGE PARSE ERROR', error);
    return null;
  }
};

const setAuth = (auth: AuthModel | null) => {
  try {
    if (auth) {
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      storage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('AUTH STORAGE SAVE ERROR', error);
  }
};

const removeAuth = () => {
  try {
    storage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH STORAGE REMOVE ERROR', error);
  }
};

// Kiểm tra người dùng có đăng nhập không
const checkAuth = (): boolean => {
  const auth = getAuth();
  return !!(auth && auth.Token);
};

// Setup axios interceptor
export function setupAxios(axiosInstance: AxiosInstance) {
  axiosInstance.defaults.headers.Accept = 'application/json';

  axiosInstance.interceptors.request.use(
    (config) => {
      const auth = getAuth();
      if (auth) {
        config.headers.Authorization = `Bearer ${auth.Token}`;
        config.headers.Username = auth.Username;
        config.headers.RoleID = auth.RoleID.toString();
        if (auth.ProjectID) {
          config.headers.ProjectID = auth.ProjectID.toString();
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeAuth(); // clear token
        window.location.href = '/auth'; // redirect login
      }
      return Promise.reject(error);
    }
  );
}

export { getAuth, setAuth, removeAuth, checkAuth, AUTH_STORAGE_KEY };