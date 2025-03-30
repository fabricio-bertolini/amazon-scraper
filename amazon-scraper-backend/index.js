import express from "express";
import cors from "cors";
import path from "path";
import { handleScrapeRequest } from "./src/scraper.js";

const app = express();
const PORT = 3000;

// Enable CORS for cross-origin requests
app.use(cors());

// Serve the built frontend files
const frontendPath = path.join(import.meta.dir, "../amazon-scraper-frontend/dist");
app.use(express.static(frontendPath));

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html")); // Serve the index.html file
});

// Serve scrape.html for the /scrape route
app.get("/scrape", (req, res) => {
  res.sendFile(path.join(frontendPath, "scrape.html")); // Serve the scrape.html file
});

// API endpoint for scraping
app.get("/api/scrape", handleScrapeRequest); // Delegate to the scraper handler

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message || "Unknown error"); // Log the error
  res.status(500).json({ error: err.message || "Internal Server Error" }); // Fallback error message
});