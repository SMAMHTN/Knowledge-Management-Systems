import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

function ThemeDecoder() {
  const initialThemes = JSON.parse(getCookie('theme'));
  const [themes, setThemes] = useState(initialThemes);
  const [decodedTheme, setDecodedTheme] = useState(null);
  // console.log('themes ========================', themes);

  useEffect(() => {
    setDecodedTheme({
      primary: themes.primary_color || '',
      secondary: themes.secondary_color || '',
    });
  }, [themes]);

  // Log the decodedTheme values to the console
  // console.log('Decoded Theme:', decodedTheme);

  // Return null to prevent rendering a DOM element
  return null;
}

export default ThemeDecoder;
