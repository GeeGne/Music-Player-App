//  JSON DATA
import samples from '../Data/Samples.json';

//  SUMMARY
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playerTapeSummary from './Shared/player-tape.js';
import playlistAddNewSummary from './Shared/playlist-add-new.js';

//  SHARED
import {audioState, userAction} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {pageSelectUpdate, updateNavCover, updateTimer} from './Shared/nav.js';

//  UTILS
import {getSampleID, getSample} from './Utils/sample.js';
import {allSongsPlaylist} from './Utils/playlists.js';

//  Current Screen
const currentPage = window.location.href;

//  CSS Styles
let generalSyle;
let animationStyle;
let navStyle;
let headerStyle;
let playerTapeStyle;
let addToPlaylistStyle;
let newPlaylistStyle;
let sharedPlaylistStyle;
let allSognsStyle;

//  All Songs Elements Section
let topSectionElement;
let allSongsImageElement;
let totalSongsElement;
let shuffleButton;
let playListElement;
let allSongsListsElements;
let AllSongsCoversElements;
let addToPlaylistButtonElements;


function allSongsSettings () {
  audioState.screen = 'All Songs';
  audioState.section === "" && (audioState.section = 'all-songs');
  audioState.playList = allSongsPlaylist;
  audioState.sampleId = getSampleID();
  audioState.state = 'pause';
  audioState.audio = new Audio(getSample().sampleLocation);
  updateTimer('new audio');
  updateNavCover();
  updatePlayerTape('songTitle');
  updatePlayerTape('expand');
  updatePlayerTape('pause');
  updatePlayerTape('favourite');
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
  allSognsStyle = await import('../Styles/all-songs.scss');
}

function updateSelectors () {
  topSectionElement = document.querySelector('.js-top-section');
  allSongsImageElement = document.querySelector('.js-all-songs-image');
  totalSongsElement = document.querySelector('.js-total-songs');
  shuffleButton = document.querySelector('.js-shuffle-button');
  playListElement = document.querySelector('.js-list-container');
}

function updateListeners () {
  shuffleButton.addEventListener('click', () => userAction('shuffle', shuffleButton, 'button'));
  allSongsImageElement.addEventListener('click', () => userAction('play', 'pause play button'));
}

function addAllSongsSelectors() {
  allSongsListsElements = document.querySelectorAll('.js-list');
  allSongsListsElements.forEach(
    sample => sample.addEventListener(
      'click', () => userAction('play', sample)
    )
  );

  AllSongsCoversElements = document.querySelectorAll('.js-cover-container');
  addToPlaylistButtonElements = document.querySelectorAll('.js-add-to-playlist-button');
  addToPlaylistButtonElements.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      userAction('add song to playlist', element)
    });
  });
}

function allSongsHTML () {
  const {list} = allSongsPlaylist;
  const {length} = list;
  let html = '';

  const totalSongs = () => {
    totalSongsElement.textContent = `${allSongsPlaylist.totalTracks} Songs`;
  }

  list.forEach(sampleID => {
    let matchedSample;
    
    samples.forEach(sample => sample.id === sampleID && (matchedSample = sample));

    matchedSample && (
      html += 
      `
        <li class="list js-list" data-sample-id="${matchedSample.id}">
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
      <li class="list">
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

export function allSongsToggle (action, element) {
  const styleWhenPause = () => {
    allSongsListsElements.forEach(sample => {
      sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0');
      sample.style.setProperty('--text-color', 'black');
    });

    AllSongsCoversElements.forEach(sample => 
      sample.style.setProperty('--before-opacity', '0')
    );

    allSongsImageElement.classList.add('paused');
  }

  const styleWhenPlay = () => {
    allSongsListsElements.forEach(sample => {
      if (getSampleID('element', sample) === audioState.sampleId) {
        sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0.6');
        sample.style.setProperty('--text-color', 'white')
      } 
    });

    AllSongsCoversElements.forEach(cover =>
      getSampleID('element', cover) === audioState.sampleId && 
      cover.style.setProperty('--before-opacity', '1')
    );

    allSongsImageElement.classList.remove('paused');
  }

  if (action === 'change icon') {

    if (audioState.state === 'pause') {
      styleWhenPause();
    } else if (audioState.state === 'play') {   
      styleWhenPause();
      styleWhenPlay()
    }  
  }
}
      
async function updateSummary() {
  updateSelectors();
  await addStyleSheets();
  allSongsSettings();
  updateListeners();
  allSongsHTML();
  addAllSongsSelectors();;
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
  playlistAddNewSummary();
}

currentPage.includes('all-songs') && updateSummary();

