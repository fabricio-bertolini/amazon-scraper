// Add event listener to the scrape button
document.getElementById("scrape-btn").addEventListener("click", async () => {
  // Get the keyword input value from the input field
  const keyword = document.getElementById("keyword").value;

  // Get the results container where scraped data will be displayed
  const resultsDiv = document.getElementById("results");

  // Validate if the keyword is provided
  if (!keyword) {
    resultsDiv.innerHTML = "<p>Please enter a keyword.</p>"; // Show error message if input is empty
    return;
  }

  // Show loading message while fetching data from the backend
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    // Fetch data from the backend API using the provided keyword
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    
    // Check if the response is not successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response from the API
    const data = await response.json();

    // Handle errors returned by the API
    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`; // Display error message
      return;
    }

    // Render the product data dynamically in the results container
    resultsDiv.innerHTML = data
      .map(
        (product) => `
        <div class="product">
          <h3>${product.title}</h3>
          <img src="${product.image}" alt="${product.title}" />
          <p>Rating: ${product.rating}</p>
          <p>Reviews: ${product.formattedReviews}</p>
          <p>Price: ${product.formattedPrice}</p>
        </div>
      `
      )
      .join(""); // Join all product HTML strings into one
  } catch (error) {
    // Log any errors to the console and display an error message
    console.error("Frontend error:", error.message);
    resultsDiv.innerHTML = `<p>Failed to fetch data: ${error.message}</p>`;
  }
});