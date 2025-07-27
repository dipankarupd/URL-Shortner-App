import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
      <span className="text-red-700 text-sm">{error}</span>
    </div>
  );
};