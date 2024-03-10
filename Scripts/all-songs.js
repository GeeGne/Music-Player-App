//  JSON DATA
import samples from '../Data/Samples.json';

//  SUMMARY
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playerTapeSummary from './Shared/player-tape.js';

//  SHARED
import {audioState, userAction,
  calAndConvTotalWidthToEM, 
  rightSideElement, updateAudioState
} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {
  pageSelectUpdate, 
  updateNavCover, updateTimer
} from './Shared/nav.js';

//  UTILS
import {
  getSampleID, 
  getSample
} from './Utils/sample.js';
import {allSongsPlaylist} from './Utils/playlists.js';

//  Current Screen
const currentPage = window.location.href;

//  CSS Styles
let generalSyle;
let animationStyle;
let navStyle;
let headerStyle;
let playerTapeStyle;
let allSognsStyle;

//  All Songs Elements Section
let topSectionElement;
let totalSongsElement;
let shuffleButton;
let playListElement;
let allSongsListsElements;


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
}

async function addStyleSheets () {
  generalSyle = await import('../Styles/Shared/general.scss');
  animationStyle = await import('../Styles/Shared/animation.scss');
  navStyle = await import('../Styles/Shared/nav.scss');
  headerStyle = await import('../Styles/Shared/header.scss');
  playerTapeStyle = await import('../Styles/Shared/player-tape.scss');
  allSognsStyle = await import('../Styles/all-songs.scss');
}

function updateSelectors () {
  topSectionElement = document.querySelector('.js-top-section');
  totalSongsElement = document.querySelector('.js-total-songs');
  shuffleButton = document.querySelector('.js-shuffle-button');
  playListElement = document.querySelector('.js-list-container');

}
function updateListeners () {
  shuffleButton.addEventListener('click', () => userAction('shuffle', shuffleButton, 'button'));
}
function addAllSongsSelectors() {
  allSongsListsElements = document.querySelectorAll('.js-list');
  allSongsListsElements.forEach(
    sample => sample.addEventListener(
      'click', () => userAction('play', sample)
    )
  );
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
          <div class="cover-container">
            <img src="${matchedSample.cover}">
          </div>
          <h3>${matchedSample.artistName} - ${matchedSample.artistName}</h3>
        </li>
      `
    );  
  });
  
  length === 0 && (
    html =
    `
      <li class="list js-list data-sample-id="${matchedSample.id}">
        <div class="cover-container">
          <img src="/Img/Default/Playlist-emtpy-default.jpg">
        </div>
        <h3>There's No Songs added</h3>
      </li>
    `
  );
  
  playListElement.innerHTML = html;
  totalSongs();
}

function cardSpread (list, playlistId, action) {
  if (action === 'out') {
    list.style.setProperty('--before-transform', 'translateX(0.3em)');
    playListCoverElement.forEach(cover => {
      const {coverId} = cover.dataset;
      coverId === playlistId && (cover.style.transform = 'translateX(-0.3em)');
    });
  } else {
    list.style.setProperty('--before-transform', 'translateX(0)');
    playListCoverElement.forEach(cover => {
      const {coverId} = cover.dataset;
      coverId === playlistId && (cover.style.transform = 'translateX(0)');
    });
  }
}

export function currentPlaylistToggle (action, element) {

  const styleWhenPause = () => {
    currentPlaylistLists.forEach(sample => {
      sample.style.setProperty('--before-opacity', '0');
      sample.style.setProperty('--text-color', 'black');
      sample.style.setProperty('--background-change', 'linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgb(191, 191, 191) 50%, rgba(255, 255, 255, 0) 100%)');
    });
  }

  const styleWhenPlay = sample => {
    if (sample) {
      sample.style.setProperty('--before-opacity', '1');
      sample.style.setProperty('--text-color', 'white');
      sample.style.setProperty('--background-change', 'linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgb(48, 48, 48) 50%, rgba(255, 255, 255, 0) 100%)');
    } else if (!sample) {
      currentPlaylistLists.forEach(sample => {
        if (getSampleID('element', sample) === audioState.sampleId) {
          sample.style.setProperty('--before-opacity', '1');
          sample.style.setProperty('--text-color', 'white');
          sample.style.setProperty('--background-change', 'linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgb(48, 48, 48) 50%, rgba(255, 255, 255, 0) 100%)');
        }  
      });
    }
  }

  if (action === 'change icon') {

    if (audioState.state === 'pause') {
      styleWhenPause();
    } else if (audioState.state === 'play') {   
      styleWhenPause();

      element ? 
      styleWhenPlay(element) : 
      currentPlaylistLists.forEach(sample => 
        getSampleID('element', sample) === audioState.sampleId && styleWhenPlay(sample)
      );
    }  
  }

  if (action === 'update favourite list') {
    const {playList} = audioState.playLists[0];
    let cover1;
    let cover2;
    let cover3;

    playList.list.forEach((id, i) => {
      i === 0 && samples.forEach(sample => sample.id === id && (cover1 = sample.cover));
      i === 1 && samples.forEach(sample => sample.id === id && (cover2 = sample.cover));
      i === 2 && samples.forEach(sample => sample.id === id && (cover3 = sample.cover));
    });

    favouritesCoverElement.src = cover1 || '/Img/Default/playlist-default.jpg' ;
    favouritesListElement.style.setProperty('--playList-cover-2', `url('${cover2 || ''}')`);
    favouritesListElement.style.setProperty('--playList-cover-3', `url('${cover3 || ''}')`);
    favouritesTitleElement.innerHTML = ` 
      <h3>${playList.name}</h3>
      <h3>(${playList.totalTracks} tracks)</h3>
    `;

    if (audioState.playList.name === 'Favourites') {
      currentListHTML();
      addCurrentListsSelectors();
    }
  }

  if (action === 'update current playlist HTML') {
    currentListHTML();
    addCurrentListsSelectors();
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
}

currentPage.includes('all-songs') && updateSummary();

