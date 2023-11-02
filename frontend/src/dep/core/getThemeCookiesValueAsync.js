'use server';

import { getCookie } from 'cookies-next';
// import Cookies from 'js-cookie';
// import { cookies } from 'next/headers';
import { cookies } from 'next/headers';
import { CoreAPIGET } from './coreHandler';

async function getThemeCookiesValueAsync() {
  try {
    const ThemeValue = getCookie('theme');
    return JSON.parse(ThemeValue);
  } catch (error) {
    // An error occurred, so set the theme cookies using SetThemeCookies
    const response = await CoreAPIGET('loginuser');
    const response2 = await CoreAPIGET('setting');
    const ThemeID = (response.status !== 401) ? response.body.Data.AppthemeID : response2.body.Data.AppthemeID;
    const responseTheme = await CoreAPIGET(`theme?AppthemeID=${ThemeID}`);
    const themevaluestring = JSON.stringify(responseTheme.body.Data.AppthemeValue);
    // cookies().set({
    //   name: 'theme',
    //   value: themevaluestring,
    //   sameSite: 'lax',
    //   path: '/',
    // });
    return JSON.parse(themevaluestring);
  }
}

export default getThemeCookiesValueAsync;
