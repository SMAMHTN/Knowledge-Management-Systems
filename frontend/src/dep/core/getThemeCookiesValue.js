import { getCookie } from 'cookies-next';

function getThemeCookiesValue() {
  try {
    const ThemeValue = getCookie('theme');
    return JSON.parse(ThemeValue);
  } catch (err) {
    return getThemeCookiesValue();
  }
}

export default getThemeCookiesValue;
