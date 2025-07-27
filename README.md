# URL Shortener

A full-stack URL shortener application with a Go backend API, React frontend, and CLI tool. Built with Redis for fast data retrieval and Docker for easy deployment.

## 🚀 Features

- **Fast URL Shortening**: Redis-backed storage for lightning-fast URL resolution
- **Rate Limiting**: IP-based rate limiting to prevent abuse (configurable quota)
- **Custom Short URLs**: Users can specify custom short codes or get auto-generated ones
- **Expiry Support**: Set custom expiration times for URLs (default: 24 hours)
- **Multiple Interfaces**: Web app, REST API, and CLI tool
- **CORS Enabled**: Ready for cross-origin requests
- **Docker Support**: Containerized backend with Docker Compose

## 🏗️ Architecture

```
├── api/          # Go backend API (Dockerized)
├── app/          # React frontend application  
├── cli/          # CLI tool for URL shortening
└── docker-compose.yml
```

## 🛠️ Tech Stack

**Backend (API)**
- **Go** with [Fiber](https://gofiber.io/) web framework
- **Redis** for data storage and rate limiting
- **Docker** for containerization
- **UUID** for generating short codes

**Frontend (App)**
- **React** application
- **Vite** for development and build

**CLI**
- **Go** command-line interface
- HTTP client for API communication

## 📋 Prerequisites

- Docker and Docker Compose
- Go 1.23+ (for CLI development)
- Node.js 22+ (for React app)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/dipankarupd/URL-Shortner-App.git
cd URL-Shortner-App
```

### 2. Start Backend Services
```bash
# Start Go API and Redis with Docker Compose
docker-compose up -d

# API will be available at http://localhost:3000
```

### 3. Start React Frontend
```bash
cd app
npm install
npm run dev

# Frontend will be available at http://localhost:5173
```

### 4. Build and Use CLI Tool
```bash
cd cli
go build -o shorten main.go

# Basic usage
./shorten https://google.com

# With custom short code
./shorten https://google.com -s mylink
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### `POST /api/v1` - Shorten URL
Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "short": "custom-code",  // optional
  "expiry": 24            // optional, hours
}
```

**Response (200 OK):**
```json
{
  "url": "https://example.com",
  "short": "http://localhost:3000/abc123",
  "expiry": 24,
  "rate_limit": 9,
  "rate_limit_reset": 29
}
```

**Error Responses:**
- `400` - Invalid URL or malformed JSON
- `403` - Custom short code already in use
- `429` - Rate limit exceeded
- `500` - Server error

#### `GET /:shortCode` - Resolve URL
Redirect to the original URL using the short code.

**Example:**
```bash
curl -L http://localhost:3000/abc123
# Redirects to original URL with 301 status
```

### Rate Limiting
- **Default Quota**: 10 requests per IP
- **Reset Time**: 30 minutes
- **Storage**: Redis database 1

### Features

**Domain Protection**: Prevents shortening of the service's own domain to avoid infinite loops.

**HTTPS Enforcement**: All URLs are automatically converted to HTTPS before storage.

**Auto-generated Codes**: If no custom short code is provided, a 6-character UUID is generated.

**Expiry Management**: URLs expire after the specified time (default: 24 hours).

## 🖥️ CLI Tool Usage

The CLI tool provides a simple interface to interact with the URL shortener API.

### Installation
```bash
cd cli
go build -o shorten main.go
```

### Usage
```bash
# Basic shortening (auto-generated code)
./shorten https://google.com

# Custom short code
./shorten https://google.com -s mylink

# Custom API endpoint
./shorten https://google.com -api http://your-api.com/api/v1

# Help
./shorten -h
```

### CLI Features
- **Simple Interface**: Just provide the URL and optional short code
- **Error Handling**: Clear error messages from API responses
- **Rate Limit Display**: Shows remaining requests and reset time
- **Flexible API URL**: Can target different API endpoints

## 🐳 Docker Configuration

### Services

**API Service**
- Built from `./api` directory
- Exposes port 3000
- Environment variables loaded from `.env`
- Depends on Redis service

**Redis Service**
- Redis 7.0-alpine image
- Exposes port 6379
- Persistent volume for data

### Environment Variables

Create a `.env` file in the root directory:

```env
APP_PORT=:3000
DOMAIN=http://localhost:3000
API_QUOTA=10
DB_ADDR=redis:6379
DB_PASS=
```

## 💻 Development

### Backend Development
```bash
cd api
go mod tidy
go run main.go
```

### Frontend Development
```bash
cd app
npm install
npm run dev
```

### CLI Development
```bash
cd cli
go run main.go https://example.com -s test
```

## 🧪 Testing the API

### Using cURL
```bash
# Shorten a URL
curl -X POST http://localhost:3000/api/v1 \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com", "short": "google"}'

# Access shortened URL
curl -L http://localhost:3000/google
```

### Using the Web Interface
1. Open http://localhost:5173
2. Enter a URL to shorten
3. Optionally specify a custom short code
4. Get your shortened URL

## 📁 Project Structure

```
url-shortener/
│
├── api/                    # Go backend
│   ├── routes/
│   │   ├── shorten.go     # URL shortening logic
│   │   └── resolve.go     # URL resolution logic
│   ├── database/          # Redis connection
│   ├── helpers/           # Utility functions
│   ├── main.go           # Application entry point
│   ├── Dockerfile        # Docker configuration
│   └── go.mod            # Go dependencies
│
├── app/                   # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── cli/                   # CLI tool
│   ├── main.go           # CLI application
│   └── go.mod            # Go dependencies
│
├── docker-compose.yml     # Docker services
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Configurable via `APP_PORT` environment variable
- **Domain**: Set via `DOMAIN` for generating full short URLs
- **Rate Limit**: Adjustable via `API_QUOTA`
- **Redis**: Connection via `DB_ADDR` and `DB_PASS`

### CORS Configuration
Currently configured for React development server:
- **Allowed Origins**: `http://localhost:5173`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Credentials**: Enabled

## 🚦 Rate Limiting Details

The API implements IP-based rate limiting:
- Each IP gets a quota of requests (default: 10)
- Reset period: 30 minutes
- Quota stored in Redis database 1
- Rate limit info returned in API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🔗 Links

- **API Docs**: See above API documentation
- **Go Fiber**: https://gofiber.io/
- **Redis**: https://redis.io/
- **React**: https://reactjs.org/

---

**Built with ❤️ using Go, React, and Redis**