const apiKey = '203fd2878e43aa75db6dfe5754ecea12';
const youtubeApiKey = 'AIzaSyDee926eH8gCj64elrgyg7w7lrOK4NAJKI';

// Function to extract the movie ID from the URL query parameter
function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('movieId');
}

// Function to fetch and display movie details on the page
function fetchMovieDetails() {
    const movieId = getMovieIdFromUrl();
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not OK. Status: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(movie => {
            const moviePoster = document.querySelector('.movie-poster img');
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            moviePoster.alt = movie.title;

            const movieTitle = document.getElementById('movieTitle');
            movieTitle.textContent = movie.title;

            const releaseDate = document.getElementById('releaseDate');
            releaseDate.textContent = `Release Date: ${movie.release_date}`;

            const genres = document.getElementById('genres');
            genres.textContent = `Genres: ${movie.genres.map(genre => genre.name).join(', ')}`;

            const runtime = document.getElementById('runtime');
            runtime.textContent = `Runtime: ${movie.runtime} minutes`;

            const userScore = document.getElementById('userScore');
            userScore.textContent = `User Score: ${movie.vote_average}`;

            const overview = document.getElementById('overview');
            overview.textContent = `Overview: ${movie.overview}`;

            const director = document.getElementById('director');
            const directorInfo = movie.credits.crew.find(person => person.job === 'Director');
            if (directorInfo) {
                director.textContent = `Director: ${directorInfo.name}`;
            } else {
                director.textContent = 'Director: Not available';
            }

            // Fetch and display movie cast with images
            fetchMovieCast(movie.credits.cast);

            // Display the movie trailer
            displayMovieTrailer(movie.videos.results);
        })
        .catch(err => console.error(err));
}

// Function to fetch and display movie cast on the page
function fetchMovieCast(cast) {
    const castList = document.getElementById('castList');

    cast.forEach(actor => {
        // Check if actor profile path is available
        if (!actor.profile_path) {
            return; // Skip adding cast member without a profile image
        }

        // Create a card for each cast member
        const card = document.createElement('div');
        card.classList.add('castCard', 'cast-card', 'mb-3');

        // Create an image element for the cast member
        const castImage = document.createElement('img');
        castImage.src = `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
        castImage.alt = actor.name;
        castImage.classList.add('cast-image');

        // Create a card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('castBody');

        // Create a heading for the cast member's name
        const castName = document.createElement('h6');
        castName.textContent = actor.name;
        castName.classList.add('cast-title');

        // Append the image and name to the card body
        cardBody.appendChild(castName);

        // Append the card body to the card
        card.appendChild(castImage);
        card.appendChild(cardBody);

        // Append the card to the castList
        castList.appendChild(card);
    });
}

// Function to display the movie trailer
function displayMovieTrailer(videos) {
    const trailerPlayer = document.getElementById('trailerPlayer');
    const trailer = videos.find(video => video.type === 'Trailer');

    if (trailer) {
        const trailerButton = document.getElementById('trailerButton');
        trailerButton.addEventListener('click', () => {

            trailerButton.style.display = 'block';
            trailerPlayer.style.display = 'none';

            window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
        });
    } else {
        trailerPlayer.textContent = 'Trailer not available.';
    }
}
// Call the function to fetch and display movie details
fetchMovieDetails();