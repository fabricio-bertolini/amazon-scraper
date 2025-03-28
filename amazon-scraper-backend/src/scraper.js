import axios from "axios";
import { JSDOM } from "jsdom";
import UserAgent from "user-agents";

const userAgent = new UserAgent({ deviceCategory: "desktop" });

export const scrapeAmazon = async (keyword) => {
  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    console.log("Scraping URL:", url);

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": userAgent.toString(),
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        Host: "www.amazon.com",
        "Accept-Encoding": "gzip, deflate, br,zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        TE: "Trailers",
        "Upgrade-Insecure-Requests": 1,
        Connection: "keep-alive",
      },
    });

    const dom = new JSDOM(html);
    const items = dom.window.document.querySelectorAll("[data-component-type='s-search-result']");

    const products = [];

    if (items) {
      console.log("Number of items found:", items.length);

      items.forEach((item) => {
        const priceWhole = item.querySelector(".a-price-whole")?.textContent.trim() || "N/A";
        if (priceWhole === "N/A") {
          return; // Skip if priceWhole is empty
        }
        const title = item.querySelector("h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal span")?.textContent.trim() || "N/A";
        const rating = item.querySelector(".a-icon-alt")?.textContent.trim() || "N/A";
        const reviews = item.querySelector(".a-size-small .a-link-normal")?.textContent.trim() || "N/A";
        const image = item.querySelector(".s-image")?.src || "N/A";
        const priceFraction = item.querySelector(".a-price-fraction")?.textContent.trim() || "00";
        const price = priceWhole !== "N/A" ? `${priceWhole}.${priceFraction}` : "N/A";

        const formattedReviews = reviews !== "N/A" ? reviews.replace(/[^0-9]/g, "") : "0";
        const formattedPrice = price.replace(/\.(?=.*\.)/, "").replace(".", ",");

        if (title !== "N/A") {
          products.push({ title, rating, formattedReviews, image, formattedPrice });
        }
      });
    }

    console.log("Products scraped:", products);
    return products;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw new Error("Failed to scrape Amazon");
  }
};

export const handleScrapeRequest = async (req, res) => {
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
};