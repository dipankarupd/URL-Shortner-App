export interface ShortenRequest {
  url: string;
  short?: string;
}

export interface ShortenResponse {
  url: string;
  short: string;
  expiry: number;
  rate_limit: number;
  rate_limit_reset: number;
}

export interface ErrorResponse {
  error: string;
  rate_limit_reset?: number;
}