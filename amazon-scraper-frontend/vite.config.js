import { defineConfig } from "vite";

// Export Vite configuration
export default defineConfig({
  root: "./src", // Set the root directory for the project to the "src" folder
  build: {
    outDir: "dist", // Specify the output directory for the build files
    rollupOptions: {
      input: {
        main: "src/index.html", // Entry point for the homepage
        scrape: "src/scrape.html", // Entry point for the scrape page
      },
    },
  },
});
