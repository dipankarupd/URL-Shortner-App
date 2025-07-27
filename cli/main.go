package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// Request structure matching your API
type ShortenRequest struct {
	URL         string `json:"url"`
	CustomShort string `json:"short,omitempty"`
}

// Response structure matching your API
type ShortenResponse struct {
	URL             string        `json:"url"`
	CustomShort     string        `json:"short"`
	Expiry          time.Duration `json:"expiry"`
	XRateRemaining  int           `json:"rate_limit"`
	XRateLimitReset time.Duration `json:"rate_limit_reset"`
}

// Error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

const (
	defaultAPIURL = "http://localhost:3000/api/v1"
)

func main() {
	// Define command line flags
	var (
		shortFlag = flag.String("s", "", "Custom short URL (optional)")
		apiURL    = flag.String("api", defaultAPIURL, "API endpoint URL")
		helpFlag  = flag.Bool("h", false, "Show help")
	)

	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s [OPTIONS] <URL>\n\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "Shorten a URL using your API\n\n")
		fmt.Fprintf(os.Stderr, "Examples:\n")
		fmt.Fprintf(os.Stderr, "  %s https://google.com\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "  %s https://google.com -s mylink\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "\nOptions:\n")
		flag.PrintDefaults()
	}

	flag.Parse()

	if *helpFlag {
		flag.Usage()
		os.Exit(0)
	}

	// Get the URL from command line arguments
	args := flag.Args()
	if len(args) == 0 {
		fmt.Fprintf(os.Stderr, "Error: URL is required\n\n")
		flag.Usage()
		os.Exit(1)
	}

	url := args[0]

	// Create the request payload
	request := ShortenRequest{
		URL:         url,
		CustomShort: *shortFlag,
	}

	// Convert request to JSON
	jsonData, err := json.Marshal(request)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating request: %v\n", err)
		os.Exit(1)
	}

	// Make HTTP POST request to your API
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Post(*apiURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error making request: %v\n", err)
		fmt.Fprintf(os.Stderr, "Make sure your API server is running at %s\n", *apiURL)
		os.Exit(1)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading response: %v\n", err)
		os.Exit(1)
	}

	// Handle different response status codes
	switch resp.StatusCode {
	case http.StatusOK:
		var response ShortenResponse
		if err := json.Unmarshal(body, &response); err != nil {
			fmt.Fprintf(os.Stderr, "Error parsing response: %v\n", err)
			os.Exit(1)
		}

		// Display success response
		fmt.Printf("✅ URL shortened successfully!\n\n")
		fmt.Printf("Original URL: %s\n", response.URL)
		fmt.Printf("Short URL:    %s\n", response.CustomShort)
		fmt.Printf("Expires in:   %v hours\n", response.Expiry)
		fmt.Printf("Rate limit:   %d requests remaining\n", response.XRateRemaining)
		if response.XRateLimitReset > 0 {
			fmt.Printf("Reset time:   %v minutes\n", response.XRateLimitReset)
		}

	case http.StatusBadRequest, http.StatusForbidden, http.StatusServiceUnavailable, http.StatusInternalServerError:
		var errorResp ErrorResponse
		if err := json.Unmarshal(body, &errorResp); err != nil {
			fmt.Fprintf(os.Stderr, "Error parsing error response: %v\n", err)
			os.Exit(1)
		}
		fmt.Fprintf(os.Stderr, "❌ Error: %s\n", errorResp.Error)
		os.Exit(1)

	default:
		fmt.Fprintf(os.Stderr, "❌ Unexpected response status: %d\n", resp.StatusCode)
		fmt.Fprintf(os.Stderr, "Response: %s\n", string(body))
		os.Exit(1)
	}
}