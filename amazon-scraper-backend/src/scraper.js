// Import required modules
import axios from "axios"; // For making HTTP requests
import { JSDOM } from "jsdom"; // For parsing HTML and DOM manipulation
import UserAgent from "user-agents"; // For generating random user-agent strings
import SocksProxyAgent from "socks5-https-client/lib/Agent"; // For routing requests through a SOCKS5 proxy
import net from "net"; // For creating TCP connections (used for TOR control)

// Amazon cookie for authentication (if required)
const cookie = ''; // Replace with your Amazon cookie if needed

// TOR configuration constants
const TOR_CONTROL_HOST = "127.0.0.1"; // TOR control host (default localhost)
const TOR_CONTROL_PORT = 9051; // TOR control port (default 9051)
const TOR_CONTROL_PASSWORD = "16:8886AC82A911E91D602E34151B74D5D14A0E330E1FD0D2F5D81E85FEBC"; // Set this in your TOR configuration

// Utility function to introduce a random delay between min and max milliseconds
const delay = (min, max) => new Promise((resolve) => {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  setTimeout(resolve, ms);
});

// Function to restart the TOR circuit by sending a "NEWNYM" signal
const restartTorCircuit = async () => {
  return new Promise((resolve, reject) => {
    const socket = net.connect(TOR_CONTROL_PORT, TOR_CONTROL_HOST, () => {
      socket.write(`AUTHENTICATE "${TOR_CONTROL_PASSWORD}"\r\n`); // Authenticate with TOR control
    });

    socket.on("data", (data) => {
      const response = data.toString();
      if (response.includes("250 OK")) {
        if (response.includes("AUTHENTICATE")) {
          socket.write("SIGNAL NEWNYM\r\n"); // Request a new TOR circuit
        } else if (response.includes("SIGNAL NEWNYM")) {
          socket.end();
          resolve(); // Successfully restarted TOR circuit
        }
      } else {
        socket.end();
        reject(new Error("Failed to restart TOR circuit. Check your TOR configuration."));
      }
    });

    socket.on("error", (err) => {
      reject(err); // Handle socket errors
    });
  });
};

// Function to scrape Amazon search results for a given keyword
export const scrapeAmazon = async (keyword, retries = 3) => {
  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`; // Construct search URL
    const userAgent = new UserAgent(); // Generate a new random user agent

    console.log("Scraping URL:", url);
    console.log("Using User-Agent:", userAgent.toString());
    console.log("Using TOR Proxy: 127.0.0.1:9050");

    // Make an HTTP GET request to Amazon using a TOR proxy
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": userAgent.toString(), // Set random user-agent
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Cookie: cookie, // Include cookie if provided
      },
      httpsAgent: new SocksProxyAgent({
        socksHost: "127.0.0.1", // TOR proxy host
        socksPort: 9050,       // TOR proxy port
      }),
    });

    console.log("Response HTML:", html.slice(0, 500)); // Log the first 500 characters of the response

    // Check if the response contains a CAPTCHA or login page
    if (html.includes("<title>Robot Check</title>") || html.includes("captcha")) {
      throw new Error("Amazon blocked the request. CAPTCHA or login required.");
    }

    // Parse the HTML response using JSDOM
    const dom = new JSDOM(html);
    const items = dom.window.document.querySelectorAll("[data-component-type='s-search-result']"); // Select search result items

    const products = []; // Array to store scraped product data

    if (items) {
      console.log("Number of items found:", items.length);

      // Iterate over each search result item and extract product details
      items.forEach((item) => {
        const priceWhole = item.querySelector(".a-price-whole")?.textContent.trim() || "N/A"; // Extract whole price
        if (priceWhole === "N/A") {
          return; // Skip if priceWhole is empty
        }

        // Try multiple selectors for the title, including a specific one for Funko Pops
        const title =
          item.querySelector(".s-title-instructions-style")?.textContent.trim() || // Specific selector for products with additional titles, like Funko Pops
          item.querySelector("h2 a span")?.textContent.trim() || // Primary selector
          item.querySelector("h2 .a-link-normal")?.textContent.trim() || // Fallback selector 1
          item.querySelector("h2")?.textContent.trim() || // Fallback selector 2
          "N/A"; // Default to "N/A" if no title is found

        const rating = item.querySelector(".a-icon-alt")?.textContent.trim() || "N/A"; // Extract rating
        const reviews = item.querySelector(".a-size-small .a-link-normal")?.textContent.trim() || "N/A"; // Extract reviews count
        const image = item.querySelector(".s-image")?.src || "N/A"; // Extract image URL
        const priceFraction = item.querySelector(".a-price-fraction")?.textContent.trim() || "00"; // Extract fractional price
        const price = priceWhole !== "N/A" ? `${priceWhole}.${priceFraction}` : "N/A"; // Combine whole and fractional price

        const formattedReviews = reviews !== "N/A" ? reviews.replace(/[^0-9]/g, "") : "0"; // Format reviews count
        const formattedPrice = price.replace(/\.(?=.*\.)/, "").replace(".", ","); // Format price

        if (title !== "N/A") {
          products.push({ title, rating, formattedReviews, image, formattedPrice }); // Add product to the array
        } else {
          console.warn("Title not found for an item. HTML snippet:", item.outerHTML); // Log the item's HTML for debugging
        }
      });
    }

    console.log("Products scraped:", products);
    return products; // Return the scraped products
  } catch (error) {
    console.error("Error during scraping:", error.message || "Unknown error"); // Log the error

    if (retries > 0) {
      console.log("Restarting TOR circuit...");
      await restartTorCircuit(); // Restart TOR circuit before retrying
      console.log(`Retrying... (${3 - retries + 1}/3)`);
      await delay(2000, 5000); // Wait for 2-5 seconds before retrying
      return scrapeAmazon(keyword, retries - 1); // Retry scraping
    }

    throw new Error(error.message || "Failed to scrape Amazon. Please check your network, proxy, or cookie settings."); // Fallback error message
  }
};

// Express.js handler for scrape requests
export const handleScrapeRequest = async (req, res) => {
  try {
    const { keyword } = req.query; // Extract keyword from query parameters

    if (!keyword) {
      res.status(400).json({ error: "Keyword is required" }); // Return error if keyword is missing
      return;
    }

    const products = await scrapeAmazon(keyword); // Call scrapeAmazon with the provided keyword
    res.json(products); // Respond with the scraped products
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" }); // Consistent error response
  }
};