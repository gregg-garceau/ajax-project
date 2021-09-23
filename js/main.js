var $pokeName = document.querySelector('.poke-name');
var $pokeId = document.querySelector('.poke-id');
var $pokeImage = document.querySelector('.poke-image');
var $shinyPokeImage = document.querySelector('.poke-image-shiny');
var $pokeWeight = document.querySelector('.poke-weight');
var $pokeHeight = document.querySelector('.poke-height');
var $pokeTypeOne = document.querySelector('.poke-type-one');
var $pokeTypeTwo = document.querySelector('.poke-type-two');
var $pokeList = document.querySelectorAll('.list-item');
var $prevButton = document.querySelector('.prev-btn');
var $nextButton = document.querySelector('.next-btn');
var $onButton = document.querySelector('.on-button');
var $offButton = document.querySelector('.off-button');
var $viewScreen = document.querySelector('.pokemon-view');
var prevUrl = null;
var nextUrl = null;

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

var colorTypes = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];

function clearColorType() {
  for (var color of colorTypes) {
    $pokeTypeOne.classList.remove(color);
    $pokeTypeTwo.classList.remove(color);
    $pokeTypeOne.textContent = '';
    $pokeTypeTwo.textContent = '';
  }
}

function showPokemon(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var currentPokemon = xhr.response;

    clearColorType();

    $pokeName.textContent = capitalize(currentPokemon.name);
    $pokeId.textContent = '#' + currentPokemon.id.toString().padStart(3, '0');
    $pokeImage.src = currentPokemon.sprites.front_default;
    $shinyPokeImage.src = currentPokemon.sprites.front_shiny;
    $pokeWeight.textContent = currentPokemon.weight;
    $pokeHeight.textContent = currentPokemon.height;

    var types = currentPokemon.types;
    var pokeTypeOne = types[0].type.name;
    $pokeTypeOne.textContent = capitalize(pokeTypeOne);
    $pokeTypeOne.classList.add(pokeTypeOne);

    if (types.length === 2) {
      var pokeTypeTwo = types[1].type.name;
      $pokeTypeTwo.textContent = capitalize(pokeTypeTwo);
      $pokeTypeTwo.classList.add(pokeTypeTwo);
    }
  });
  xhr.send();
}

function pokeList(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var pokeResults = xhr.response.results;
    prevUrl = xhr.response.previous;
    nextUrl = xhr.response.next;
    var offsetHundred = nextUrl.slice(41, 44);
    var offsetThousand = nextUrl.slice(41, 45);
    offsetHundred = parseInt(offsetHundred);
    offsetThousand = parseInt(offsetThousand);
    if (offsetThousand < 1000 && offsetHundred < 902) {
      for (let i = 0; i < $pokeList.length; i++) {
        var currentPokeList = $pokeList[i];
        var pokeData = pokeResults[i];

        if (pokeData) {
          var pokeName = pokeData.name;
          var pokeUrl = pokeData.url;
          var splitUrl = pokeUrl.split('/');
          var pokeId = splitUrl[splitUrl.length - 2];
          currentPokeList.textContent = pokeId + '. ' + capitalize(pokeName);
        }
      }
    }
  });
  xhr.send();
}

function prevClick(event) {
  if (prevUrl) {
    pokeList(prevUrl);
  }
}

function nextClick(event) {
  if (nextUrl) {
    pokeList(nextUrl);
  }
}

function listClick(event) {
  var targetItem = event.target;
  if (targetItem.textContent) {
    var targetId = targetItem.textContent.split('.')[0];
  }
  showPokemon(targetId);
}

for (var listItem of $pokeList) {
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

pokeList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
showPokemon(1);
