//  JSON DATA
import samples from '../Data/Samples.json';

//  SUMMARY
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playerTapeSummary from './Shared/player-tape.js';
import playlistAddNewSummary from './Shared/playlist-add-new.js';

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
let addToPlaylistStyle;
let newPlaylistStyle;
let sharedPlaylistStyle;
let favouritesStyle;

//  Favourites Elements Section
let topSectionElement;
let favouritesImageElement;
let totalSongsElement;
let shuffleButtonElement;
let addFavButtonElement;
let playListElement;
let favouritesListsElements;
let favouritesCoversElements;
let addToPlaylistButtonElements;


function favouritesSettings () {
  audioState.screen = 'Favourites';
  audioState.section === "" && (audioState.section = 'favourites');
  // favouritesPlaylist.updatePlaylist('list', 20);
  // favouritesPlaylist.updatePlaylist('list', 7);
  // favouritesPlaylist.updatePlaylist('list', 14);
  audioState.playList = favouritesPlaylist;
  if (audioState.playList.list.length !== 0) {
    audioState.sampleId = getSampleID();
    audioState.state = 'pause';
    audioState.audio = new Audio(getSample().sampleLocation);
    updateTimer('new audio');
    updateNavCover();
    updatePlayerTape('songTitle');
    updatePlayerTape('expand');
    updatePlayerTape('pause');
    updatePlayerTape('favourite');
  } else {
    audioState.state = 'pause';
    updatePlayerTape('expand');
    updateTimer('list empty');
    updateNavCover('list empty');
    updatePlayerTape('list empty');
  }
}

async function addStyleSheets () {
  generalSyle = await import('../Styles/Shared/general.scss');
  animationStyle = await import('../Styles/Shared/animation.scss');
  navStyle = await import('../Styles/Shared/nav.scss');
  headerStyle = await import('../Styles/Shared/header.scss');
  playerTapeStyle = await import('../Styles/Shared/player-tape.scss');
  addToPlaylistStyle = await import('../Styles/Shared/playlist-add-new/add-to-playlist.scss');
  newPlaylistStyle = await import('../Styles/Shared/playlist-add-new/new-playlist.scss');
  sharedPlaylistStyle = await import('../Styles/Shared/playlist-add-new/shared.scss');
  favouritesStyle = await import('../Styles/favourites.scss');
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

function addFavouritesSelectors() {
  favouritesListsElements = document.querySelectorAll('.js-list');
  favouritesListsElements.forEach(
    sample => sample.addEventListener(
      'click', () => listType(sample)
    )
  );

  favouritesCoversElements = document.querySelectorAll('.js-cover-container');
  addToPlaylistButtonElements = document.querySelectorAll('.js-add-to-playlist-button');
  addToPlaylistButtonElements.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      userAction('add song to playlist', element)
    });
  });
}

function favouritesHTML () {
  const {list} = favouritesPlaylist;
  const {length} = list;
  let html = '';

  if (addButton) {
    samples.forEach(sample => {
      let matchedID;
      list.forEach((id) => 
        id === sample.id && (matchedID = true)
      )
      
      html +=
      `
        <li 
          class="list ${matchedID && 'checked'} js-list"
          data-list-type="add"
          data-sample-id="${sample.id}"
        >
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
        <li 
          class="list js-list animate slideDown"
          data-list-type="play"
          data-sample-id="${matchedSample.id}"
          >
          <div 
            class="cover-container js-cover-container" 
            data-sample-id="${matchedSample.id}"
          >
            <img src="${matchedSample.cover}">
          </div>
          <h3>${matchedSample.artistName} - ${matchedSample.album}</h3>
          <button 
            class="add-to-playlist-button js-add-to-playlist-button"
            data-sample-id="${matchedSample.id}"
          />
        </li>
      `
    );  
  });
  
  length === 0 && (
    html =
    `
      <li 
        class="list js-list empty animate slideDown"
        data-list-type="empty"
      >
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
        sample.style.setProperty('--text-color', 'white');
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

  if (action === 'list empty') {
    favouritesImageElement.classList.add('paused');
  }

  if (action === 'add') {
    addButton = !addButton;

    topSectionElement.classList.toggle('add');
    playListElement.classList.toggle('add');

    clearTimeout(timerID);
    addFavButtonElement.style.setProperty('--set-display', 'none');
    timerID = setTimeout(() => addFavButtonElement.style.setProperty('--set-display', 'initial'), 500);

    favouritesHTML();
    addFavouritesSelectors();
  }

  if (action === 'update favourite list') {
    favouritesHTML();
    addFavouritesSelectors();
  }
}

function listType(list) {
  const {listType} = list.dataset;
  const sampleId = Number(list.dataset.sampleId);

  if (listType === 'play') {
    userAction('play', list);
  } else if (listType === 'add') {
    favouritesPlaylist.updatePlaylist('list',sampleId);
    list.classList.toggle('checked');
  } else if (listType === 'empty') {
    favouritesToggle('add')
  }
}
      
async function updateSummary() {
  updateSelectors();
  await addStyleSheets();
  favouritesSettings();
  updateListeners();
  favouritesHTML();
  addFavouritesSelectors();
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
  playlistAddNewSummary();
}

currentPage.includes('favourites') && updateSummary();

