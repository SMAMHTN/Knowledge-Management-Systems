import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { readConf } from '@/dep/others/confHandler';
import 'react-toastify/dist/ReactToastify.css';
import { CoreAPIGET } from '@/dep/core/coreHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata = async () => {
  const response = await CoreAPIGET('setting');
  return {
    title: response.body.Data.CompanyName,
    description: `KMS Implemented for ${response.body.Data.CompanyName}`,
  };
};

// export const metadata = {
//   title: 'App',
//   description: 'App project',
// };

export default async function RootLayout({ children }) {
  const conf = await readConf('frontend_conf.json');
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/api/logo" sizes="32x32" />
      </head>
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
