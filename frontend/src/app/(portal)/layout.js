// import react, { useState } from 'react';
import '../../styles/globals.css';
import Nav from '@/components/Nav';

export default function Layout({ children }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col flex-auto antialiased flex-shrink-0 bg-gray-500">
      <Nav />
      <div className="h-full ml-16 mt-5 mb-10 md:ml-72 mr-5">
        <main>{children}</main>
      </div>
    </div>
  );
}
