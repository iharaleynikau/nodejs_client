import axios, { AxiosRequestHeaders, AxiosResponseHeaders } from 'axios';

import { refreshToken } from './viewer';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'shared/config';
import { getAccessToken, logout } from 'shared/lib';

const apiInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    (config as unknown as AxiosRequestHeaders).metadata = {
      startTime: Date.now(),
    };
    if (config.headers !== undefined) {
      const token = getAccessToken();
      if (token === null) {
        logout();
      }
      config.headers['Authorization'] = `Bearer ${token}`;

      const asUserLogin = localStorage.getItem('asUserLogin');
      if (asUserLogin) {
        config.headers['as-user-login'] = asUserLogin;
        localStorage.removeItem('asUserLogin');
      }

      const asUser = localStorage.getItem('asUser');
      if (asUser) {
        config.headers['as-user'] = asUser;
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

apiInstance.interceptors.response.use(
  (response) => {
    const endTime = Date.now();
    const res = response as unknown as AxiosResponseHeaders;
    res.config.metadata.endTime = endTime;
    res.duration = endTime - res.config.metadata.startTime;
    return response;
  },
  async (error) => {
    if (!error.response) {
      //
    } else if (error.response.status === 401) {
      try {
        const token = await refreshToken();
        const { access_token, refresh_token } = token;
        if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
          localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
          localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        } else if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
          sessionStorage.setItem(ACCESS_TOKEN_KEY, access_token);
          sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        }
        return apiInstance.request(error.config);
      } catch (e) {
        logout();
      }
    }
    return Promise.reject(error);
  },
);

export { apiInstance };
