const pokedex = document.querySelector('.pokedex-grid')
const nextButton = document.querySelector('.pokedex-nav-next')
const prevButton = document.querySelector('.pokedex-nav-prev')
nextButton.addEventListener('click', nextPage)
prevButton.addEventListener('click', prevPage)

let baseUrl = 'https://pokeapi.co/api/v2/pokemon'
let baseSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
let limit = 9;
let page = 0;
let nextPageUrl = undefined
let prevPageUrl = undefined
let pokemonCount = 0

getData()

function getData() {

    let offset = page * limit
    console.info({offset})
    let url = baseUrl + '?limit=' + limit + '&offset=' + offset

    fetch(url)
        .then(response => response.json())
        .then(data => handleData(data))
}

function handleData(data) {

    // set vars
    pokemonCount = data.count
    nextPageUrl = data.next
    prevPageUrl = data.previous

    clearPokedexGrid()

    // loop through pokemon
    for(let index in data.results) {
        // a simple variable reference for our pokemon
        const pokemon = data.results[index]

        // get our pokemon image, name, and link
        let pokemonId = pokemon.url.split('/')
            pokemonId = pokemonId[pokemonId.length-2]
        const pokemonImage = baseSpriteUrl + pokemonId + '.png'
        const pokemonName = pokemon.name
        const pokemonLink = pokemon.url

    // create html elements and set their content
        // container
        const pokemonCellElement = document.createElement('a')
              pokemonCellElement.classList.add('pokemon-cell')
              pokemonCellElement.href = pokemonLink
        // image
        const pokemonImageElement = document.createElement('img')
              pokemonImageElement.classList.add('pokemon-image')
              pokemonImageElement.src = pokemonImage
        // name
        const pokemonNameElement = document.createElement('span')
              pokemonNameElement.classList.add('pokemon-name')
              pokemonNameElement.innerText = pokemonName

        // add image and name into cell element
        pokemonCellElement.appendChild(pokemonImageElement)
        pokemonCellElement.appendChild(pokemonNameElement)

        // add cell element to pokedex grid
        pokedex.appendChild(pokemonCellElement)
    }
}

function clearPokedexGrid() {
    while(pokedex.firstChild) {
        pokedex.removeChild(pokedex.firstChild)
    }
}

function nextPage(e) {
    e.preventDefault();
    page++;
    console.info({
        page,
        condition: (page * limit) > pokemonCount
    })
    if ((page * limit) > pokemonCount) page = (pokemonCount - limit) / limit
    getData()
}

function prevPage(e) {
    e.preventDefault();
    page--;
    if (page < 0) page = 0
    getData()
}