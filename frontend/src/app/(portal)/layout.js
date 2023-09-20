// import react, { useState } from 'react';
import '../../styles/globals.css';
import Nav from '@/components/Nav';

export default function Layout({ children }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col flex-auto antialiased flex-shrink-0 bg-gray-500">
      <Nav />
      <div className="h-full mx-2 md:mx-5 mt-14 p-4 left-0 left md:left-72 md:ml-72 mb-72">
        <main>{children}</main>
      </div>
    </div>
  );
}
