document.addEventListener('DOMContentLoaded', () => {
    let cardContainer = document.querySelector('#card-container')
    let listContainer = document.querySelector('#list-container')
    fetch('http://localhost:3000/lists')
    .then(resp => resp.json())
    .then(json => {listContainer.appendChild(makeList(json))})
    document.querySelector('#movie-form form').addEventListener('submit', e => {
        e.preventDefault()
        cardContainer.innerHTML = '';
        fetch(`http://www.omdbapi.com/?t=${e.target[0].value}&apikey=8cd1a818`)
        .then(resp => resp.json())
        .then(json => {
            cardContainer.appendChild(createMovieCard(json))
            console.log(json)
            e.target.reset()
        })
    })
    document.querySelector('#list-form form').addEventListener('submit', e => {
        e.preventDefault()
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


    let imdb = document.createElement('p')
    imdb.innerText = `IMDB Rating: ${obj.Ratings[0].Value}`
    card.appendChild(imdb);

    let metascore = document.createElement('p');
    metascore.innerText = `Metascore: ${obj.Ratings[2].Value}`;
    card.appendChild(metascore);

    let rottenTomatoes = document.createElement('p')
    rottenTomatoes.innerText = `Rotten Tomatoes: ${obj.Ratings[1].Value}`;
    card.appendChild(rottenTomatoes);

    return card;
    }

    function makeList(obj){
        let listList = document.createElement('ul');
        obj.forEach(list => {
            let name = document.createElement('li');
            name.innerText = list.listName;
            name.addEventListener('click', e => {expandList(e)})
            listList.appendChild(name);
        })
        return listList;
    }

    function expandList(event){
        fetch('http://localhost:3000/lists')
        .then(resp => resp.json())
        .then(json => {
            json.forEach(list => {
                if (list.listName === event.target.innerText){
                    let movieList = document.createElement('ul');
                    list.movies.forEach(movie => {
                        let title = document.createElement('li');
                        title.innerText = movie.Title;
                        title.addEventListener('click', e => {
                            cardContainer.appendChild(createMovieCard(movie))
                        })
                        movieList.appendChild(title);
                    })
                    event.target.appendChild(movieList)
                }
            })
        })
    }
})