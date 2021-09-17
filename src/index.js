document.addEventListener('DOMContentLoaded', () => {
    let cardContainer = document.querySelector('#movie-container')
    document.querySelector('#movie-form form').addEventListener('submit', e => {
        e.preventDefault()
        cardContainer.innerHTML = '';
        fetch(`http://www.omdbapi.com/?t=${e.target[0].value}&apikey=8cd1a818`)
        .then(resp => resp.json())
        .then(json => {
            container.appendChild(createMovieCard(json))
            console.log(json)
            e.target.reset()
        })
    })
})

function createMovieCard(obj){
/*Adds movie info to the screen
Can't make it much shorter */
let card = document.createElement('div');

let title = document.createElement('h2');
title.innerText = obj.Title;
card.appendChild(title);

let poster = document.createElement('img');
poster.src = obj.Poster;
card.appendChild(poster);

let director = document.createElement('h2')
director.innerText = `Directed by ${obj.Director}`;
card.appendChild(director)

let actors = document.createElement('h3');
actors.innerText = `Starring: ${obj.Actors}`;
card.appendChild(actors);

let plot = document.createElement('p');
plot.innerText = obj.Plot;
card.appendChild(plot);

let released = document.createElement('span');
released.innerText = `Released: ${obj.Released}`;
card.appendChild(released);

let genre = document.createElement('span');
genre.innerText = `Genre: ${obj.Genre}`;
card.appendChild(genre);

let br = document.createElement('br');
card.appendChild(br);

let ratingsContainer = document.createElement('div')
let imdb = document.createElement('span')
imdb.innerText = `IMDB Rating: ${obj.imdbRating}`
ratingsContainer.appendChild(imdb);
let metascore = document.createElement('span');
metascore.innerText = `Metascore: ${obj.Metascore}`;
ratingsContainer.appendChild(metascore);
let rottenTomatoes = document.createElement('span')
rottenTomatoes.innerText = `Rotten Tomatoes: ${obj.Ratings[1].value}`;
ratingsContainer.appendChild(rottenTomatoes);
card.appendChild(ratingsContainer);

return card;
}