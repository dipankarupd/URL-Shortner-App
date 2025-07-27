import React from 'react';
import { Globe, } from 'lucide-react';

interface URLFormProps {
  url: string;
  customShort: string;
  loading: boolean;
  onUrlChange: (url: string) => void;
  onCustomShortChange: (short: string) => void;
  onSubmit: () => void;
}

export const URLForm: React.FC<URLFormProps> = ({
  url,
  customShort,
  loading,
  onUrlChange,
  onCustomShortChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4 inline mr-1" />
          Long URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/very-long-url"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
          required
        />
      </div>

      <div>
        <label htmlFor="customShort" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Short (Optional)
        </label>
        <input
          type="text"
          id="customShort"
          value={customShort}
          onChange={(e) => onCustomShortChange(e.target.value)}
          placeholder="my-custom-link"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      

      <button
        onClick={onSubmit}
        disabled={loading || !url.trim()}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>
    </div>
  );
};