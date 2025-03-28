import { defineConfig } from "vite";

export default defineConfig({
  root: "./src", // Ensure the root directory is correct
  build: {
    outDir: "dist", // Output directory for the build
    rollupOptions: {
      input: {
        main: "src/index.html", // Main homepage
        scrape: "src/scrape.html", // Scrape page
      },
    },
  },
});
