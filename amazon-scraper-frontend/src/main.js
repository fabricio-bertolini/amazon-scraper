// Add event listener to the scrape button
document.getElementById("scrape-btn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value.trim(); // Get the keyword from the input field
  if (!keyword) {
    alert("Please enter a keyword."); // Alert if the input is empty
    return;
  }

  const resultsContainer = document.getElementById("results"); // Get the results container
  resultsContainer.innerHTML = '<div class="spinner"></div>'; // Show a loading spinner

  try {
    // Make a GET request to the backend API
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText); // Log the error
      throw new Error("Failed to fetch product data. Please try again later."); // Consistent error message
    }

    const products = await response.json(); // Parse the JSON response
    if (products.length === 0) {
      resultsContainer.innerHTML = "<p>No products found for the given keyword.</p>"; // Show a message if no products are found
      return;
    }

    // Render the products in the results container
    resultsContainer.innerHTML = products
      .map(
        (product) => `
        <div class="product">
          <img src="${product.image}" alt="${product.title}" />
          <div class="product-details">
            <h3>${product.title}</h3>
            <p><strong>Rating:</strong> ${product.rating}</p>
            <p><strong>Reviews:</strong> ${product.formattedReviews}</p>
            <p><strong>Price:</strong> ${product.formattedPrice}</p>
          </div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error occurred:", error.message); // Log the error
    resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message || "An unexpected error occurred."}</p>`; // Fallback error message
  }
});