# Amazon Scraper Application

This project is a full-stack application for scraping product details from Amazon. It was made within a week as part of a coding challenge. 
The project consists of a frontend built with Vite and a backend built with Express.js. The application allows users to search for products on Amazon and view their details, including title, price, rating, and reviews.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Bun](https://bun.sh) (optional, for backend dependency management) - A fast JavaScript runtime.

## Setup Instructions

### Clone the Repository

Clone the repository to your local machine and navigate to the project directory:

```bash
git clone <repository-url>
cd amazon-scraper-main
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

### Set Amazon Cookie

1. Open your browser and navigate to Amazon.
2. Log in to your account.
3. Open the browser's developer tools, go to the "Application" tab, and copy the Cookie header value.
4. Open the file `src/scraper.js` and replace the `cookie` variable value with your own cookie.

### Proxy Setup

To avoid being blocked by Amazon, configure a list of proxies in the `src/scraper.js` file. Add your proxy URLs to the `proxies` array:

```javascript
const proxies = [
  "http://proxy1.example.com:8080",
  "http://proxy2.example.com:8080",
  // Add more proxies here
];
```

You can use free or paid proxy services. Ensure the proxies are reliable and support HTTPS.

### Using TOR as a Proxy

To use TOR as a rotating proxy:

1. Install TOR from [TOR's official website](https://www.torproject.org/).
2. Start the TOR service:
   ```bash
   tor
   ```
   By default, TOR listens on `127.0.0.1:9050` for SOCKS5 proxy connections.
3. The scraper is configured to route requests through TOR. No additional setup is required.

> **Note:** TOR may slow down requests due to its routing through multiple nodes. Ensure TOR is running before starting the backend server.

### Set Up TOR Control Password

To configure and create your own TOR control password:
> **Note:** You need to have TOR installed as a service in Windows.
1. Open your TOR configuration file (usually located at `/etc/tor/torrc` on Linux/Mac or `torrc` on Windows).
2. Add the following lines to enable the control port and set a password:
   ```
   ControlPort 9051
   HashedControlPassword <hashed-password>
   ```
3. To generate a hashed password, run the following command in your terminal:
   ```bash
   tor --hash-password <your-password>
   ```
   Replace `<your-password>` with your desired password.
4. Copy the generated hashed password and replace `<hashed-password>` in the configuration file.
5. Restart the TOR service for the changes to take effect:
   - On Linux/Mac: `sudo systemctl restart tor`
   - On Windows: Restart the TOR process manually or via the Task Manager.

Finally, update the `TOR_CONTROL_PASSWORD` constant in `src/scraper.js` with your hashed password.

### Retry Mechanism

The scraper will automatically retry up to 3 times if it encounters a `503` error. Each retry includes a 2-second delay to reduce the likelihood of being flagged.

## Running the Application

### Start the Backend First

Ensure the backend server is running before starting the frontend:

```bash
cd amazon-scraper-backend
bun run index.js
```

### Start the Frontend

Navigate to the frontend directory and start the development server:

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

## Build and Deployment

### Frontend Build

To build the frontend for production:

```bash
cd amazon-scraper-frontend
npm run build
```

The build files will be generated in the `dist` directory.

### Backend Deployment

Ensure the backend is deployed on a server with Bun installed. Copy the `amazon-scraper-backend` directory to the server and run:

```bash
bun run index.js
```

Ensure the frontend `dist` directory is also copied to the server and served as static files.
