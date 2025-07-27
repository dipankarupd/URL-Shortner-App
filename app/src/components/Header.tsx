import React from 'react';
import { Link } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
        <Link className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Shortener</h1>
      <p className="text-gray-600">Transform long URLs into short, shareable links</p>
    </div>
  );
};