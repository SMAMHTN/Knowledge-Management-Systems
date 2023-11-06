import { getCookie } from 'cookies-next';

function customObjectToString(obj) {
  // Check if the object has a custom serialization method
  if (obj && typeof obj.toString === 'function') {
    return obj.toString();
  }

  // If not, use JSON.stringify to serialize the object
  return JSON.stringify(obj);
}

function getThemeCookiesValue() {
  const themeCookie = getCookie('theme');
  // console.log('Cookie content:', themeCookie);
  const themeJson = customObjectToString(themeCookie); // Convert the object to a JSON string
  // console.log(themeJson);
  return themeJson;
}

export default getThemeCookiesValue;
