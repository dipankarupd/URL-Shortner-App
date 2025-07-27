import React, { useState } from 'react';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import type { ShortenResponse } from '../models/models';
import { formatDuration, copyToClipboard } from '../utils/formatters';

interface ResultDisplayProps {
  result: ShortenResponse;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  // Extract the short identifier from the result.short URL
  const getShortIdentifier = (shortUrl: string): string => {
    // If shortUrl is "localhost:3000/abc", we want just "abc"
    // If shortUrl is "http://localhost:3000/abc", we want just "abc"
    if (shortUrl.includes('/')) {
      const parts = shortUrl.split('/');
      return parts[parts.length - 1]; // Get the last part after the last slash
    }
    return shortUrl; // If no slash, return as-is
  };

  // Construct the full redirect URL
  const redirectUrl = `http://localhost:3000/${getShortIdentifier(result.short)}`;

  const handleCopy = async () => {
    // Copy the short URL as displayed
    const success = await copyToClipboard(result.short);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRedirect = () => {
    // Open the redirect URL which will hit your Go backend route
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center mb-2">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="font-medium text-green-800">URL Shortened Successfully!</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3 rounded border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Short URL:</p>
              <span className="text-indigo-600 text-sm truncate block">
                {result.short}
              </span>
            </div>
            <div className="flex ml-2 space-x-2">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleRedirect}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Open shortened URL (will redirect to original)"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {copied && (
            <div className="text-green-600 text-sm text-center">
              ✓ Copied to clipboard!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-600">Expires in:</p>
              <p className="font-semibold text-gray-900">{result.expiry} hours</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-600">Rate limit:</p>
              <p className="font-semibold text-gray-900">{result.rate_limit} remaining</p>
            </div>
          </div>

          {result.rate_limit_reset > 0 && (
            <div className="bg-white p-3 rounded border text-sm">
              <p className="text-gray-600">Rate limit resets in:</p>
              <p className="font-semibold text-gray-900">{formatDuration(result.rate_limit_reset)}</p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded border text-sm">
            <p className="text-blue-800">
              <strong>How it works:</strong> The redirect button will take you to the shortened URL, 
              which will then automatically redirect to your original URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};