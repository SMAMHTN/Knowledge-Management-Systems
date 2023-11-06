import getThemeCookiesValueAsync from '@/dep/core/getThemeCookiesValueAsync';
import '../../styles/globals.css';

export const metadata = {
  title: 'Login',
  description: 'Login',
};

export default async function LoginLayout({ children }) {
  const theme = await getThemeCookiesValueAsync();
  return <section style={{ backgroundColor: theme.primary_color }}>{children}</section>;
}
