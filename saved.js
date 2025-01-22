document.addEventListener("DOMContentLoaded", function () {
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];
  const movieContainer = document.querySelector(".movie-container");

  if (savedMovies.length === 0) {
    movieContainer.innerHTML = `<p class="p-3">No movies in your list yet.</p>`;
  } else {
    let cards = "";
    savedMovies.forEach((m) => {
      cards += `
        <div class="col-md-4 my-5">
          <div class="card">
            <img src="${m.Poster}" class="card-img-top" alt="" />
            <div class="card-body">
              <h5 class="card-title">${m.Title}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
              <a href="#" class="btn btn-primary modal-detail-button bg-dark" data-bs-toggle="modal" data-bs-target="#moviesDetailModal" data-imdbid="${m.imdbID}">Show Details</a>

              <button class="btn btn-danger remove-button" data-imdbid="${m.imdbID}">Remove</button>
            </div>
          </div>
        </div>
      `;
    });
    movieContainer.innerHTML = cards;
  }

  // Hapus button start
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-button")) {
      const imdbID = e.target.dataset.imdbid;
      removeMovie(imdbID);
    }
  });

  function removeMovie(imdbID) {
    let savedMovies = JSON.parse(localStorage.getItem("movies")) || [];
    savedMovies = savedMovies.filter((m) => m.imdbID !== imdbID);
    localStorage.setItem("movies", JSON.stringify(savedMovies));
    alert("Movie Berhasil dihapus dari list!");
    location.reload();
  }

  // Hapus button end

  // Show Details button start

  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("modal-detail-button")) {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMovieDetail(imdbid);
      updateUIDetail(movieDetail);
    }
  });

  async function getMovieDetail(imdbid) {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=20aeda12&i=${imdbid}`
    );
    const data = await response.json();
    return data;
  }

  function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = movieDetail;
  }

  function showMovieDetail(m) {
    return `
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <img src="${m.Poster}" class="img-fluid" />
                </div>
                <ul class="list-group">
                  <li class="list-group-item"><h4>${m.Title}</h4></li>
                  <li class="list-group-item">
                    <strong>Director :</strong> ${m.Director}
                  </li>
                  <li class="list-group-item">
                    <strong>Actors :</strong> ${m.Actors}
                  </li>
                  <li class="list-group-item">
                    <strong>Writer :</strong> ${m.Writer}
                  </li>
                  <li class="list-group-item">
                    <strong>: Plot</strong> <br />
                    ${m.Plot}
                  </li>
                </ul>
              </div>
            </div>
          `;
  }
});
// Show Details button end
