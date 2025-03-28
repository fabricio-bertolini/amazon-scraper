document.getElementById("scrape-btn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsDiv = document.getElementById("results");

  if (!keyword) {
    resultsDiv.innerHTML = "<p>Please enter a keyword.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

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
      .join("");
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>Failed to fetch data.</p>";
  }
});