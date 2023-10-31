import { getCookie } from 'cookies-next';
import { SetThemeCookies } from './coreHandler';

function getThemeCookiesValue() {
  try {
    const ThemeValue = getCookie('theme');
    return JSON.parse(ThemeValue);
  } catch (error) {
    // An error occurred, so set the theme cookies using SetThemeCookies
    return SetThemeCookies()
      .then(() => {
        const ThemeValue = getCookie('theme');
        return JSON.parse(ThemeValue);
      });
  }
}

export default getThemeCookiesValue;
