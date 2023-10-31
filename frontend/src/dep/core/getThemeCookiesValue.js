// import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

function getThemeCookiesValue() {
  const ThemeValue = getCookie('theme');
  console.log(ThemeValue);
  return JSON.parse(ThemeValue);
}

export default getThemeCookiesValue;
