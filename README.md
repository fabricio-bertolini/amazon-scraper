# Amazon Scraper Application

This project is a full-stack application for scraping product details from Amazon. It consists of a frontend built with Vite and a backend built with Express.js. The application allows users to search for products on Amazon and view their details, including title, price, rating, and reviews.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Bun](https://bun.sh) (optional, for backend dependency management) - A fast JavaScript runtime.

## Setup Instructions

### Clone the Repository

Clone the repository to your local machine and navigate to the project directory:

```bash
git clone <repository-url>
cd AmazonApp
```

### Install Dependencies

#### Frontend
Navigate to the frontend directory and install the required dependencies using npm:

```bash
cd amazon-scraper-frontend
npm install
```

#### Backend
Navigate to the backend directory and install the required dependencies using Bun:

```bash
cd ../amazon-scraper-backend
bun install
```

> **Note:** If you do not have Bun installed, you can install it from [Bun's official website](https://bun.sh).

## Running the Application

### Start the Backend

Run the backend server using Bun:

```bash
bun run index.js
```

The backend will start on `http://localhost:3000`.

### Start the Frontend

Navigate to the frontend directory and start the development server using npm:

```bash
cd ../amazon-scraper-frontend
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Example Usage

### Scraping Products

1. Open the frontend in your browser at `http://localhost:5173`.
2. Navigate to the "Scrape API" page by clicking the link on the homepage.
3. Enter a keyword (e.g., "laptop") in the input field and click the "Scrape" button.
4. The application will display product details scraped from Amazon, including the title, price, rating, and reviews.

### API Endpoint

You can also use the `/api/scrape` endpoint directly to fetch product details programmatically:

- **Endpoint:** `http://localhost:3000/api/scrape`
- **Method:** `GET`
- **Query Parameter:** `keyword` (e.g., `?keyword=laptop`)

Example usage with `curl`:

```bash
curl "http://localhost:3000/api/scrape?keyword=laptop"
```

This will return a JSON response containing the scraped product details.
