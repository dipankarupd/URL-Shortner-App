import type { ShortenRequest, ShortenResponse, ErrorResponse } from '../models/models';

export class URLService {
  static async shortenURL(request: ShortenRequest): Promise<ShortenResponse> {
    const response = await fetch('http://localhost:3000/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new Error(errorData.error);
    }

    return data as ShortenResponse;
  }
}