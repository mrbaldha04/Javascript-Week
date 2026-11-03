// https://www.omdbapi.com/?i=tt3896198&apikey=9b125d2c
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let message = document.getElementById("message");
let movieList = document.getElementById("movieList");
let favBtn = document.getElementById("favBtn");
let sectionTitle = document.getElementById("sectionTitle");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function searchMovies(movie)
{
    message.innerHTML = "Loading...";
    movieList.innerHTML = "";

    try
    {
        let api = await fetch(`https://www.omdbapi.com/?s=${movie}&apikey=9b125d2c`);
        if (!api.ok)
        {
            throw new Error("Something went wrong");
        }
        let data = await api.json();
        console.log(data);
        if (data.Response == "False")
        {
            throw new Error("Incorrect Movie Name, Enter Correct");
        }
        message.innerHTML = "";
        data.Search.forEach(function(movie) {
            let card = document.createElement("div");
            card.className = "card rounded-xl p-3 shadow-lg hover:scale-105 duration-300";

            let img = document.createElement("img");
            img.src = movie.Poster;
            img.alt = movie.Title;
            img.className = "w-full rounded-lg";

            let title = document.createElement("h3");
            title.innerHTML = movie.Title;
            title.className = "font-bold mt-4";

            let date = document.createElement("p");
            console.log(movie);
            date.innerHTML = movie.Released;
            date.className = "text-sm text-white mt-4";

            let fav = document.createElement("button");

            let isFav = favorites.some(function(item)
            {
                return item.imdbID === movie.imdbID;
            });

            fav.innerHTML = isFav ? "Remove Favorite" : "Add Favorite";
            fav.className = "mt-4 w-full rounded-lg bg-red-600 px-3 py-2 font-semibold hover:bg-red-700";

            fav.addEventListener("click", function()
            {
                let exists = favorites.some(function(item)
                {
                    return item.imdbID === movie.imdbID;
                });

                if (exists)
                {
                    favorites = favorites.filter(function(item)
                    {
                        return item.imdbID !== movie.imdbID;
                    });
                }
                else
                {
                    favorites.push(movie);
                }
                localStorage.setItem("favorites", JSON.stringify(favorites));
                fav.innerHTML = exists ? "Add Favorite" : "Remove Favorite";
            });

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(date);
            card.appendChild(fav);

            movieList.appendChild(card);
        });

    }
    catch(error)
    {
        message.innerHTML = "Error = " + error.message;
    }
}

searchBtn.addEventListener("click", function()
{
    let movie = searchInput.value.trim();
    if (movie == "")
    {
        message.innerHTML = "Please enter a movie name";
    }
    else
    {
        searchMovies(movie);
    }
});

searchInput.addEventListener("keydown", function(event)
{
    if (event.key == "Enter")
    {
        searchBtn.click();
    }
});

favBtn.addEventListener("click", function()
{
    movieList.innerHTML = "";
    message.innerHTML = "";
    sectionTitle.innerHTML = "My Favorites";

    if (favorites.length === 0)
    {
        message.innerHTML = "No favorite movies saved yet";
    }
    else
    {
        favorites.forEach(function(movie)
        {
            createMovieCard(movie);
        });
    }
});

function createMovieCard(movie)
{

    let card = document.createElement("div");
    card.className = "card rounded-xl p-3 shadow-lg hover:scale-105 duration-300";

    let img = document.createElement("img");
    img.src = movie.Poster;
    img.alt = movie.Title;
    img.className = "w-full rounded-lg";

    let title = document.createElement("h3");
    title.innerHTML = movie.Title;
    title.className = "font-bold mt-4";

    let date = document.createElement("p");
    date.innerHTML = movie.Released;
    date.className = "text-sm text-white mt-4";

    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = "Remove Favorite";
    removeBtn.className = "mt-4 w-full rounded-lg bg-red-600 px-3 py-2 font-semibold hover:bg-red-700";

    removeBtn.addEventListener("click", function() {

        favorites = favorites.filter(function(item) {
            return item.imdbID !== movie.imdbID;
        });

        localStorage.setItem("favorites", JSON.stringify(favorites));

        card.remove();

        if (favorites.length === 0) {           
            message.innerHTML = "No favorite movies saved yet";
        }

    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(removeBtn);

    movieList.appendChild(card);
}