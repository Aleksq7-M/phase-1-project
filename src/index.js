document.addEventListener('DOMContentLoaded', () => {
    let cardContainer = document.querySelector('#card-container')
    let listContainer = document.querySelector('#list-container')
    //all localhost calls will be to /lists
    //render lists stored in db.json on DOMContentLoaded
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
    //New List Event Listener
    document.querySelector('#list-form form').addEventListener('submit', e => {
        e.preventDefault()
        let configObj = {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body:JSON.stringify({
                listName: e.target[0].value,
                movies: []
            })
        }
        fetch('http://localhost:3000/lists', configObj)
        .then(resp => resp.json())
        .then(json => {
            let newList = document.createElement('li')
            let listList = document.querySelector('.listList');
            newList.innerText = json.listName;
            newList.addEventListener('click', e => expandList(e))
            listList.appendChild(newList)
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


    let imdb = document.createElement('p')
    imdb.innerText = `IMDB Rating: ${obj.Ratings[0].Value}`
    card.appendChild(imdb);

    let metascore = document.createElement('p');
    metascore.innerText = `Metascore: ${obj.Ratings[2].Value}`;
    card.appendChild(metascore);

    let rottenTomatoes = document.createElement('p')
    rottenTomatoes.innerText = `Rotten Tomatoes: ${obj.Ratings[1].Value}`;
    card.appendChild(rottenTomatoes);

    let addToList = document.createElement('form');
    let label = document.createElement('label');
    label.for = 'list-selector';
    label.innerText = 'Add to List:'
    let listSelect = document.createElement('select');
    listSelect.name = "list-selector";
    listSelect.id = "list-selector";
    document.querySelectorAll('.list-name, .list-name_clicked').forEach(node => {
        let option = document.createElement('option');
        option.innerText = node.innerText.split('\n')[0];
        option.value = node.id;
        listSelect.appendChild(option);
    })
    addToList.appendChild(label);
    addToList.appendChild(listSelect);
    let submit = document.createElement('input');
    submit.type = 'submit';
    submit.innerText = 'Add'
    addToList.appendChild(submit);
    addToList.addEventListener('submit', e => {
        e.preventDefault();
        let configObj = {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body:JSON.stringify({
                    Actors: obj.Actors,
                    Director: obj.Director,
                    Genre: obj.Genre,
                    Plot: obj.Plot,
                    Poster: obj.Poster,
                    Ratings: obj.Ratings,
                    Release: obj.Release,
                    Title: obj.Title
            })
        }
        fetch(`http://localhost:3000/lists/${e.target[0].value}/movies`, configObj)
        .then(resp => resp.json())
        .then(json => {
            let listList = document.querySelector('.listList');
            listList.childNodes.forEach(node => {
                if (node.id === e.target[0].value && node.className.split('_')[1]==='clicked'){
                    let li = document.createElement('li');
                    li.innerText = json.Title;
                    node.childNodes[1].appendChild(li);
                }
            })
        })
    })
    card.appendChild(addToList);

    return card;
    }

    function makeList(obj){
        let listList = document.createElement('ul');
        listList.className = 'listList';
        obj.forEach(list => {
            let name = document.createElement('li');
            name.innerText = list.listName;
            name.className = 'list-name'
            name.id = list.id;
            name.addEventListener('click', e => {
                name.className += '_clicked'
                expandList(e)})
            listList.appendChild(name);
        })
        return listList;
    }

    function expandList(event){
        fetch(`http://localhost:3000/lists/${event.target.id}/movies`)
        .then(resp => resp.json())
        .then(json => {
            let movieList = document.createElement('ul')
            json.forEach(movie =>{
                let li = document.createElement('li');
                li.innerText = movie.Title;
                li.addEventListener('click', (e) => {
                    console.log(e)
                    e.stopPropagation()
                    cardContainer.innerHTML = ''
                    cardContainer.appendChild(createMovieCard(movie))
                })
                movieList.appendChild(li);
            })
            event.target.appendChild(movieList);
        })
    }
})