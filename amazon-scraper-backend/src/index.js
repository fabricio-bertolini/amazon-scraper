import express from "express";
import cors from "cors";
import path from "path";
import { handleScrapeRequest } from "./scraper.js";

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve the built frontend files
const frontendPath = path.join(import.meta.dir, "../amazon-scraper-frontend/dist");
app.use(express.static(frontendPath));

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Serve scrape.html for the /scrape route
app.get("/scrape", (req, res) => {
  res.sendFile(path.join(frontendPath, "scrape.html"));
});

// Consolidated endpoint for scraping
app.get("/api/scrape", handleScrapeRequest);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});