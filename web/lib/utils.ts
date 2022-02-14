import Cookies from 'js-cookie';
import { COOKIE_TOKEN_NAME } from './constant';

export const setAccessTokenInCookie = (token: string) => {
  Cookies.set(COOKIE_TOKEN_NAME, token, {
    expires: 1000 * 60 * 60 * 24, // 1 day
  });
};

export const removeAccessTokenInCookie = () => {
  Cookies.remove(COOKIE_TOKEN_NAME);
};
