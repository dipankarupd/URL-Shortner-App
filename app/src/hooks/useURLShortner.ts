import { useState } from 'react';
import type { ShortenRequest, ShortenResponse } from '../models/models';
import  { URLService } from '../services/urlService';

export const useURLShortener = () => {
  const [url, setUrl] = useState('');
  const [customShort, setCustomShort] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState<string>('');

  const shortenURL = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const requestBody: ShortenRequest = {
      url: url
    };

    if (customShort.trim()) {
      requestBody.short = customShort.trim();
    }

    try {
      const resultData = await URLService.shortenURL(requestBody);
      setResult(resultData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return {
    url,
    customShort,
    loading,
    result,
    error,
    setUrl,
    setCustomShort,
    shortenURL,
  };
};