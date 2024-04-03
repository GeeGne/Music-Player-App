//  Data
import samples from '../Data/Samples.json';

//  Summary
import playerTapeSummary from './Shared/player-tape.js';
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playlistAddNewSummary from './Shared/playlist-add-new.js';

//  Shared
import {
  rightSideElement, audioState,
  updateAudioState, userAction
} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {pageSelectUpdate, updateNavCover, updateTimer} from './Shared/nav.js';

//  Utils
import {currentTime} from './Utils/timer.js';
import {getSampleID, getSample} from './Utils/sample.js';
import {playNchillPlaylist} from './Utils/playlists.js';
import calAndConvTotalWidthToEM from './Utils/lenghtCal.js';

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
let homeStyle;


//  Play-n-Chill Elements Section
let playNchillElement;
export let playNchillLists;
let topSectionElement;

async function addStyleSheets() {
  generalSyle = await import('../Styles/Shared/general.scss');
  animationStyle = await import('../Styles/Shared/animation.scss');
  navStyle = await import('../Styles/Shared/nav.scss');
  headerStyle = await import('../Styles/Shared/header.scss');
  playerTapeStyle = await import('../Styles/Shared/player-tape.scss');
  addToPlaylistStyle = await import('../Styles/Shared/playlist-add-new/add-to-playlist.scss');
  newPlaylistStyle = await import('../Styles/Shared/playlist-add-new/new-playlist.scss');
  sharedPlaylistStyle = await import('../Styles/Shared/playlist-add-new/shared.scss');
  homeStyle = await import('../Styles/home.scss');
}

function updateEventListeners () {
  playNchillLists.forEach(sample => {
    sample.addEventListener('click', () => userAction('play', sample));
    sample.addEventListener('mouseenter', () => playChillToggle('show icon', sample));
    sample.addEventListener('mouseleave', () => playChillToggle('hide icon', sample));
  });
}

function homeSettings () {
  audioState.screen = 'Home';
  audioState.section === "" && (audioState.section = 'playNchill');
  audioState.playList = playNchillPlaylist;
  audioState.sampleId = getSampleID();
  audioState.state = 'pause';
  audioState.audio =  new Audio(getSample().sampleLocation);
  console.log(audioState);
  updateTimer('new audio');
  updateNavCover();
  updatePlayerTape('songTitle');
  updatePlayerTape('expand');
  updatePlayerTape('pause');
  updatePlayerTape('favourite');
}

function updateNewLists() {
  playNchillLists = document.querySelectorAll('.js-music-list');
}

function playNchillHTML () {
  let html = '';

  samples.forEach(sample => {
    html += `
    <li class="js-music-list" data-sample-id="${sample.id}">
      <img class="cover" src="${sample.cover}">
      <div class="title">
        <h3>${sample.album}</h3>
        <h3>${sample.artistName}</h3>
      </div>
    </li>
    `;
  })

  playNchillElement.innerHTML = html;
}

let currentIndex = 0;
function slideCalculate (direction) {
  const twoSongsWidthEM = 35.2;
  const scrollWidthEM = twoSongsWidthEM;
  const topSectionWidthEM = calAndConvTotalWidthToEM(topSectionElement);  
  const playNchillWidthEM = calAndConvTotalWidthToEM(playNchillElement);

  if (direction === 'next') {
    currentIndex -= scrollWidthEM;
    currentIndex < (-1 * playNchillWidthEM + topSectionWidthEM) && 
    (currentIndex = -1 * playNchillWidthEM + topSectionWidthEM); 
  } else { 
    currentIndex += scrollWidthEM;
    currentIndex > 0 && (currentIndex = 0);
  }
}

export function playChillToggle (type, element) {

  if (type === 'next' || type === 'previous') {
    slideCalculate(type);
    playNchillLists.forEach(element => element.style.transform = `translateX(${currentIndex}em)`);
  }

  if (type ==='change icon') {

    if (audioState.state === 'pause') {
      playNchillLists.forEach(list => list.classList.remove('play-icon'));
    } else if (audioState.state === 'play') {
      playNchillLists.forEach(list => list.classList.remove('play-icon'));
      playNchillLists.forEach(
        list => getSampleID('element', list) === audioState.sampleId && list.classList.add('play-icon')
      );
    }
  }
  
  if (type === 'show icon') {
    element.classList.add('play-icon');
  } 

  if (type === 'hide icon') {
    if (getSampleID('element', element) !== audioState.sampleId ||
      audioState.state === 'pause') {
    element.classList.remove('play-icon');
    }
  }
}

export function updateMarginMain (type) {
  if (type) {
    rightSideElement.style.paddingBottom = '12em';
  } else {
    rightSideElement.style.paddingBottom = '3em';
  }
}

function updateSummary() {
  playNchillElement = document.querySelector('.js-music-list-container');
  topSectionElement = document.querySelector('.js-top-section');
  addStyleSheets();
  playNchillHTML(samples);
  updateNewLists();
  updateEventListeners();
  homeSettings();
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
  playlistAddNewSummary();
}

currentPage.includes('home') && updateSummary();
