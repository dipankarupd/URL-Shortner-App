package main

import (
	"fmt"
	"log"
	"os"

	"github.com/akhil/fiber-url-shortener/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {
	app.Get("/:url", routes.ResolveURL)
	app.Post("/api/v1", routes.ShortenURL)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println(err)
	}

	app := fiber.New()

	// ✅ Enable CORS with custom config
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173", // comma-separated for multiple
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS,PATCH",
		AllowHeaders:     "*",
		ExposeHeaders:    "Content-Length",
		AllowCredentials: true,
		MaxAge:           3600,
	}))

	app.Use(logger.New())

	setupRoutes(app)

	log.Fatal(app.Listen(os.Getenv("APP_PORT")))
}
