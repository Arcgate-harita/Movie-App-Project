const apiKey = '203fd2878e43aa75db6dfe5754ecea12';

function fetchMovies() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not OK. Status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0) {
        throw new Error('No movie data found');
      }

      const movies = data.results.slice(0, 3); // Get the first 3 movies for the carousel
      const carouselInner = document.querySelector('.carousel-inner');

      movies.forEach((movie, index) => {
        const slideItem = document.createElement('div');
        slideItem.classList.add('carousel-item');

        if (index === 0) {
          slideItem.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
        img.alt = movie.title;
        img.classList.add('d-block', 'w-100', 'custom-image'); // Bootstrap classes to style the image

        slideItem.appendChild(img);
        carouselInner.appendChild(slideItem);

        img.addEventListener('click', () => {
          // Redirect to movie details page with the movie ID as a query parameter
          navigateToMovieDetailsPage(movie.id);
        });

      });
    })
    .catch(err => console.error(err));
}

fetchMovies();


const moviesPerPage = 6; // Number of movies to fetch per page
let currentPage = 1; // Current page of movie data


function fetchMoviesCard() {

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${currentPage}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not OK. Status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0) {
        // No more movie data to load
        return;
      }

      const movies = data.results;
      const movieCardsContainer = document.getElementById('movieCardsContainer');

      movies.forEach(movie => {

        const colDiv = document.createElement('div');
        colDiv.classList.add('col-lg-2', 'col-md-6', 'mb-2');

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'movie-card'); // Add custom class for the movie card

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.classList.add('card-img-top');


        img.addEventListener('click', () => {
          // Redirect to movie details page or any other action you want
          location.href = `movieDescription.html?movieId=${movie.id}`;
        });
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = movie.title;
        cardBodyDiv.appendChild(cardTitle);

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = `Release Date: ${movie.release_date}`;
        cardBodyDiv.appendChild(cardText);

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBodyDiv);

        colDiv.appendChild(cardDiv);
        movieCardsContainer.appendChild(colDiv);


      });
    })
    .catch(err => console.error(err));
}

function loadMoreMovies() {
  fetchMoviesCard();
  currentPage++;
}


// Event listener for movie card click to navigate to the movie details page
document.addEventListener('click', event => {
  const clickedElement = event.target;

  // Check if the clicked element is a movie card
  if (clickedElement.classList.contains('movie-card')) {
    const movieId = clickedElement.dataset.movieId;
    navigateToMovieDetailsPage(movieId);
  }
});

// Function to navigate to the movie details page with the movie ID as a query parameter
function navigateToMovieDetailsPage(movieId) {
  const url = `movieDescription.html?movieId=${movieId}`;
  window.location.href = url;
}

// Trigger loading more movies when the user scrolls to the bottom of the page
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMoreMovies();
  }
});

// Initial load of movie cards
fetchMoviesCard();


function searchSimilarMovies(query) {

  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  fetch(searchUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not OK. Status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0) {
        // No movie data found for the search query
        displayNoResults();
        return;
      }

      const movies = data.results;
      displayMovieResults(movies);
    })
    .catch(err => {
      console.error(err);
    });
}

function displayNoResults() {
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = '<div>No movies found for the search query.</div>';
  movieCardsContainer.style.display = "none";
  movieCardsContainer.classList.add("movieCardsContainer");
}

function displayMovieResults(movies) {
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = ''; // Clear previous results

  movies.forEach(movie => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-lg-2', 'col-md-7', 'mb-2');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'movie-card');

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;
    img.classList.add('card-img-top');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = movie.title;
    cardBodyDiv.appendChild(cardTitle);

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = `Release Date: ${movie.release_date}`;
    cardBodyDiv.appendChild(cardText);

    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBodyDiv);

    img.addEventListener('click', () => {
      // Redirect to movie details page with the movie ID as a query parameter
      navigateToMovieDetailsPage(movie.id);
    });

    colDiv.appendChild(cardDiv);
    searchResultsDiv.appendChild(colDiv);
    movieCardsContainer.style.display = "none";

  });
}


// Trigger loading more movies when the user scrolls to the bottom of the page
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMoreMovies();
  }
});

// Event listener for the search form submission
const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput.value.trim();
  searchSimilarMovies(searchTerm);
}); 