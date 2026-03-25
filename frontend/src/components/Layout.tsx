import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
      
      <footer className="border-t border-gray-200 py-8 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 Meeting Booking App
        </div>
      </footer>
    </div>
  );
};

export default Layout;
