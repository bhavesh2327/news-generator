document.addEventListener("DOMContentLoaded", initApp);

const config = {
  apiKey: "YOUR_NEWS_API_KEY", // Replace with your actual API key
  country: "us",
  category: "general",
  pageSize: 6,
};

// Initialize App
function initApp() {
  fetchNews();
  setupEventListeners();
}

// Fetch news from API
async function fetchNews() {
  let url = `https://newsapi.org/v2/top-headlines?country=${config.country}&pageSize=${config.pageSize}&apiKey=${config.apiKey}`;

  if (config.category !== "current-affairs") {
    url += `&category=${config.category}`;
  }

  toggleLoading(true);

  try {
    const response = await fetch(url);
    
    // Check for API errors
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      displayNews(data.articles);
    } else {
      displayMessage("No news available for the selected category.");
      console.warn("No articles available. Check if the category exists or verify the API key.");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    displayMessage("Failed to load news. Please try again later.");
  }

  toggleLoading(false);
}

// Display news articles in the UI
function displayNews(articles) {
  const newsContainer = document.getElementById("news-articles");
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const newsCard = document.createElement("div");
    newsCard.className = "col-md-4";

    newsCard.innerHTML = `
      <div class="card mb-4 news-card">
        <img src="${article.urlToImage || 'default-image.jpg'}" class="card-img-top" alt="${article.title}">
        <div class="card-body">
          <h5 class="card-title">${article.title}</h5>
          <p class="card-text">${article.description || "Description not available."}</p>
          <p class="card-text"><small class="text-muted">Published on ${new Date(article.publishedAt).toLocaleDateString()}</small></p>
          <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
        </div>
      </div>
    `;
    newsContainer.appendChild(newsCard);
  });
}

// Show a message in the UI
function displayMessage(message) {
  const newsContainer = document.getElementById("news-articles");
  newsContainer.innerHTML = `<p class="message">${message}</p>`;
}

// Toggle loading indicator
function toggleLoading(show) {
  const loading = document.getElementById("loading");
  loading.style.display = show ? "block" : "none";
}

// Set up event listeners
function setupEventListeners() {
  document.getElementById("category-select").addEventListener("change", (e) => {
    config.category = e.target.value;
    fetchNews();
  });
}
