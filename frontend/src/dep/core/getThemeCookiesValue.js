import { getCookie } from 'cookies-next';

function getThemeCookiesValue() {
  const ThemeValue = getCookie('theme');
  return JSON.parse(ThemeValue);
}

export default getThemeCookiesValue;
