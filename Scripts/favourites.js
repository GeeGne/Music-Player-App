//  JSON DATA
import samples from '../Data/Samples.json';

//  SUMMARY
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playerTapeSummary from './Shared/player-tape.js';

// //  SHARED
import {audioState, userAction} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {pageSelectUpdate, updateNavCover, updateTimer} from './Shared/nav.js';

// //  UTILS
import {getSampleID, getSample} from './Utils/sample.js';
import {favouritesPlaylist} from './Utils/playlists.js';

//  Current Screen
const currentPage = window.location.href;

//  Add to Fav Button
let addButton;

//  CSS Styles
let generalSyle;
let animationStyle;
let navStyle;
let headerStyle;
let playerTapeStyle;
let favourites;

//  Favourites Elements Section
let topSectionElement;
let favouritesImageElement;
let totalSongsElement;
let shuffleButtonElement;
let addFavButtonElement;
let playListElement;
let favouritesListsElements;
let favouritesCoversElements;


function favouritesSettings () {
  audioState.screen = 'Favourites';
  audioState.section === "" && (audioState.section = 'favourites');
  favouritesPlaylist.updatePlaylist('list', 20);
  favouritesPlaylist.updatePlaylist('list', 7);
  favouritesPlaylist.updatePlaylist('list', 14);
  audioState.playList = favouritesPlaylist;
  audioState.sampleId = getSampleID();
  audioState.state = 'pause';
  audioState.audio = new Audio(getSample().sampleLocation);
  updateTimer('new audio');
  updateNavCover();
  updatePlayerTape('songTitle');
  updatePlayerTape('expand');
  updatePlayerTape('pause');
}

async function addStyleSheets () {
  generalSyle = await import('../Styles/Shared/general.scss');
  animationStyle = await import('../Styles/Shared/animation.scss');
  navStyle = await import('../Styles/Shared/nav.scss');
  headerStyle = await import('../Styles/Shared/header.scss');
  playerTapeStyle = await import('../Styles/Shared/player-tape.scss');
  favourites = await import('../Styles/favourites.scss');
}

function updateSelectors () {
  topSectionElement = document.querySelector('.js-top-section');
  favouritesImageElement = document.querySelector('.js-favourites-image');
  totalSongsElement = document.querySelector('.js-total-songs');
  addFavButtonElement = document.querySelector('.js-add-fav-button');
  shuffleButtonElement = document.querySelector('.js-shuffle-button');
  playListElement = document.querySelector('.js-list-container');
}

function updateListeners () {
  shuffleButtonElement.addEventListener('click', () => userAction('shuffle', shuffleButtonElement, 'button'));
  addFavButtonElement.addEventListener('click', () => favouritesToggle('add'));
  favouritesImageElement.addEventListener('click', () => userAction('play', 'pause play button'));
}

function addAllSongsSelectors() {
  favouritesListsElements = document.querySelectorAll('.js-list');
  favouritesListsElements.forEach(
    sample => sample.addEventListener(
      'click', () => userAction('play', sample)
    )
  );

  favouritesCoversElements = document.querySelectorAll('.js-cover-container');
}

function favouritesHTML () {
  const {list} = favouritesPlaylist;
  const {length} = list;
  let html = '';

  if (addButton) {
    samples.forEach(sample => {
      html +=
      `
        <li class="list js-list animate slideUp" data-sample-id="${sample.id}">
          <div 
            class="cover-container js-cover-container" 
            data-sample-id="${sample.id}"
          >
            <img src="${sample.cover}">
          </div>
          <h3>${sample.artistName} - ${sample.album}</h3>
        </li>
      `
    });

    playListElement.innerHTML = html;
    return;
  }

  const totalSongs = () => {
    totalSongsElement.textContent = `${favouritesPlaylist.totalTracks} Songs`;
  }

  list.forEach(sampleID => {
    let matchedSample;
    
    samples.forEach(sample => sample.id === sampleID && (matchedSample = sample));

    matchedSample && (
      html += 
      `
        <li class="list js-list animate slideUp" data-sample-id="${matchedSample.id}">
          <div 
            class="cover-container js-cover-container" 
            data-sample-id="${matchedSample.id}"
          >
            <img src="${matchedSample.cover}">
          </div>
          <h3>${matchedSample.artistName} - ${matchedSample.album}</h3>
        </li>
      `
    );  
  });
  
  length === 0 && (
    html =
    `
      <li class="list animate slideUp">
        <div class="cover-container">
          <img src="/Img/Default/Playlist-emtpy-default.jpg">
        </div>
        <h3>No Songs are currently added</h3>
      </li>
    `
  );
  
  playListElement.innerHTML = html;
  totalSongs();
}

let timerID;
export function favouritesToggle (action, element) {
  const styleWhenPause = () => {
    favouritesListsElements.forEach(sample => {
      sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0');
      sample.style.setProperty('--text-color', 'black');
    });

    favouritesCoversElements.forEach(sample => 
      sample.style.setProperty('--before-opacity', '0')
    );

    favouritesImageElement.classList.add('paused');
  }

  const styleWhenPlay = () => {
    favouritesListsElements.forEach(sample => {
      if (getSampleID('element', sample) === audioState.sampleId) {
        sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0.6');
        sample.style.setProperty('--text-color', 'white')
      } 
    });

    favouritesCoversElements.forEach(cover =>
      getSampleID('element', cover) === audioState.sampleId && 
      cover.style.setProperty('--before-opacity', '1')
    );

    favouritesImageElement.classList.remove('paused');
  }

  if (action === 'change icon') {

    if (audioState.state === 'pause') {
      styleWhenPause();
    } else if (audioState.state === 'play') {   
      styleWhenPause();
      styleWhenPlay()
    }  
  }

  if (action === 'add') {
    addButton = !addButton;

    topSectionElement.classList.toggle('add');
    playListElement.classList.toggle('add');

    clearTimeout(timerID);
    addFavButtonElement.style.setProperty('--set-display', 'none');
    timerID = setTimeout(() => addFavButtonElement.style.setProperty('--set-display', 'initial'), 500);

    favouritesHTML();
  }
}
      
async function updateSummary() {
  updateSelectors();
  await addStyleSheets();
  favouritesSettings();
  updateListeners();
  favouritesHTML();
  addAllSongsSelectors();;
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
}

currentPage.includes('favourites') && updateSummary();

