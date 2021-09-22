var $pokeName = document.querySelector('.poke-name');
var $pokeId = document.querySelector('.poke-id');
var $pokeImage = document.querySelector('.poke-image');
var $pokeWeight = document.querySelector('.poke-weight');
var $pokeHeight = document.querySelector('.poke-height');
var $pokeTypeOne = document.querySelector('.poke-type-one');
var $pokeTypeTwo = document.querySelector('.poke-type-two');
var $pokeList = document.querySelectorAll('.list-item');
var $prevButton = document.querySelector('.prev-btn');
var $nextButton = document.querySelector('.next-btn');
var prevUrl = null;
var nextUrl = null;

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function pokeList(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var pokeResults = xhr.response.results;
    prevUrl = xhr.response.previous;
    nextUrl = xhr.response.next;

    for (let i = 0; i < $pokeList.length; i++) {
      var currentPokeList = $pokeList[i];
      var pokeData = pokeResults[i];

      if (pokeData) {
        var pokeName = pokeData.name;
        var pokeUrl = pokeData.url;
        var splitUrl = pokeUrl.split('/');
        var pokeId = splitUrl[splitUrl.length - 2];
        currentPokeList.textContent = pokeId + '. ' + capitalize(pokeName);
      } else {
        currentPokeList.textContent = '';
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

$prevButton.addEventListener('click', prevClick);
$nextButton.addEventListener('click', nextClick);

pokeList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
