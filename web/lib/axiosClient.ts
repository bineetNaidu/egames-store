import axiosLib from 'axios';
import Cookie from 'js-cookie';
import { COOKIE_TOKEN_NAME } from './constant';

const instance = axiosLib.create({
  baseURL: 'http://localhost:4242/api',
  headers: {
    'x-access-token': Cookie.get(COOKIE_TOKEN_NAME) ?? '',
  },
});

export { instance as axiosClient };
