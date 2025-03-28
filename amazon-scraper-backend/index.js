import express from "express";
import cors from "cors";
import path from "path";
import { scrapeAmazon } from "./src/scraper.js";

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve the built frontend files
const frontendPath = path.join(import.meta.dir, "../amazon-scraper-frontend/dist");
app.use(express.static(frontendPath));

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "homepage.html"));
});

// Consolidated endpoint for scraping
app.get("/api/scrape", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      res.status(400).json({ error: "Keyword is required" });
      return;
    }

    const products = await scrapeAmazon(keyword);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});