/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';
import { AuthModel } from './_models';

const AUTH_STORAGE_KEY = 'authData';
const storage = localStorage;

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

const checkAuth = (): boolean => {
  const auth = getAuth();
  return !!(auth && auth.Token);
};

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
        removeAuth();
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
  );
}

export { getAuth, setAuth, removeAuth, checkAuth, AUTH_STORAGE_KEY };
