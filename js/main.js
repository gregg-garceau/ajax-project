const $pokeName = document.querySelector('.poke-name');
const $pokeId = document.querySelector('.poke-id');
const $pokeImage = document.querySelector('.poke-image');
const $shinyPokeImage = document.querySelector('.poke-image-shiny');
const $pokeWeight = document.querySelector('.poke-weight');
const $pokeHeight = document.querySelector('.poke-height');
const $pokeTypeOne = document.querySelector('.poke-type-one');
const $pokeTypeTwo = document.querySelector('.poke-type-two');
const $pokeList = document.querySelectorAll('.list-item');
const $prevButton = document.querySelector('.prev-btn');
const $nextButton = document.querySelector('.next-btn');
const $onButton = document.querySelector('.on-button');
const $offButton = document.querySelector('.off-button');
const $viewScreen = document.querySelector('.pokemon-view');
const $searchbar = document.querySelector('.pokemon-search');
const $pokeLoad = document.querySelector('.poke-load');
const $listLoad = document.querySelector('.list-load');
let prevUrl = null;
let nextUrl = null;

const capitalize = str => {
  return str[0].toUpperCase() + str.substr(1);
};

const openModalPoke = () => {
  $pokeLoad.classList.remove('hidden');
};

const closeModalPoke = () => {
  $pokeLoad.classList.add('hidden');
};

const openListLoad = () => {
  $listLoad.classList.remove('hidden');
};

const closeListLoad = () => {
  $listLoad.classList.add('hidden');
};

const colorTypes = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];

const clearColorType = () => {
  for (const color of colorTypes) {
    $pokeTypeOne.classList.remove(color);
    $pokeTypeTwo.classList.remove(color);
    $pokeTypeOne.textContent = '';
    $pokeTypeTwo.textContent = '';
  }
};

const showPokemon = id => {
  openModalPoke();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const currentPokemon = xhr.response;
    closeModalPoke();
    clearColorType();

    $pokeName.textContent = capitalize(currentPokemon.name);
    $pokeId.textContent = '#' + currentPokemon.id.toString().padStart(3, '0');
    $pokeImage.src = currentPokemon.sprites.front_default;
    $shinyPokeImage.src = currentPokemon.sprites.front_shiny;
    $pokeWeight.textContent = currentPokemon.weight;
    $pokeHeight.textContent = currentPokemon.height;

    const types = currentPokemon.types;
    const pokeTypeOne = types[0].type.name;
    $pokeTypeOne.textContent = capitalize(pokeTypeOne);
    $pokeTypeOne.classList.add(pokeTypeOne);

    if (types.length === 2) {
      const pokeTypeTwo = types[1].type.name;
      $pokeTypeTwo.textContent = capitalize(pokeTypeTwo);
      $pokeTypeTwo.classList.add(pokeTypeTwo);
    }
  });
  xhr.send();
};

const pokeList = url => {
  openListLoad();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    closeListLoad();
    const pokeResults = xhr.response.results;
    prevUrl = xhr.response.previous;
    nextUrl = xhr.response.next;
    let offsetHundred = nextUrl.slice(41, 44);
    let offsetThousand = nextUrl.slice(41, 45);
    offsetHundred = parseInt(offsetHundred);
    offsetThousand = parseInt(offsetThousand);
    if (offsetThousand < 1000 && offsetHundred < 902) {
      for (let i = 0; i < $pokeList.length; i++) {
        const currentPokeList = $pokeList[i];
        const pokeData = pokeResults[i];

        if (pokeData) {
          const pokeName = pokeData.name;
          const pokeUrl = pokeData.url;
          const splitUrl = pokeUrl.split('/');
          const pokeId = splitUrl[splitUrl.length - 2];
          currentPokeList.textContent = pokeId + '. ' + capitalize(pokeName);
        }
      }
    }
  });
  xhr.send();
};

const prevClick = event => {
  if (prevUrl) {
    pokeList(prevUrl);
  }
};

const nextClick = event => {
  if (nextUrl) {
    pokeList(nextUrl);
  }
};

const listClick = event => {
  const targetItem = event.target;
  if (targetItem.textContent) {
    const targetId = targetItem.textContent.split('.')[0];
    showPokemon(targetId);
  }
};

for (const listItem of $pokeList) {
  listItem.addEventListener('click', listClick);
}

$prevButton.addEventListener('click', prevClick);
$nextButton.addEventListener('click', nextClick);

$onButton.addEventListener('click', function (event) {
  $viewScreen.classList.remove('hidden');
});

$offButton.addEventListener('click', function (event) {
  $viewScreen.classList.add('hidden');
});

$searchbar.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    if (!$searchbar.value || $searchbar.value === ' ') {
      return;
    }

    if ($searchbar.value) {
      const pokemonSearch = $searchbar.value.toLowerCase();
      showPokemon(pokemonSearch);
    }
  }
});

pokeList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
showPokemon(1);
