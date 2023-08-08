import React from "react";
import "../../styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <div className="min-h-screen flex flex-col flex-auto antialiased flex-shrink-0 bg-gray-500">
        <Navbar />
        <Sidebar />
        <div className="h-full ml-16 mt-5 mb-10 md:ml-72 mr-5">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}