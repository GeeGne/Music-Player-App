//  Data
import samples from '../Data/Samples.json';

//  Summary
import playerTapeSummary from './Shared/player-tape.js';
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';

//  Shared
import {
  calAndConvTotalWidthToEM, 
  rightSideElement, audioState,
  updateAudioState, userAction
} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {pageSelectUpdate, updateNavCover, updateTimer} from './Shared/nav.js';

//  Utils
import {currentTime} from './Utils/timer.js';
import {
  getSampleID, 
  getSample
} from './Utils/sample.js';
import {playNchillPlaylist} from './Utils/playlists.js';

//  Current Screen
const currentPage = window.location.href;

//  CSS Styles
let generalSyle;
let animationStyle;
let navStyle;
let headerStyle;
let playerTapeStyle;
let homeStyle;


//  Play-n-Chill Elements Section
let playNchillElement;
export let playNchillLists;
let topSectionContainer;

async function addStyleSheets() {
  generalSyle = await import('../Styles/Shared/general.scss');
  animationStyle = await import('../Styles/Shared/animation.scss');
  navStyle = await import('../Styles/Shared/nav.scss');
  headerStyle = await import('../Styles/Shared/header.scss');
  playerTapeStyle = await import('../Styles/Shared/player-tape.scss');
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
function slideCalulate (direction, element, i) {  
  if (direction === 'next') {
    i === 0 && (currentIndex -= 35.2);

    currentIndex < 
    (-1 * calAndConvTotalWidthToEM(playNchillElement) + 
    calAndConvTotalWidthToEM(topSectionContainer)) && 
    (currentIndex = -1 * calAndConvTotalWidthToEM(playNchillElement) + 
    calAndConvTotalWidthToEM(topSectionContainer));

    element.style.transform = `translateX(${currentIndex}em)`;
  } else {
    i === 0 && (currentIndex += 35.2);
    currentIndex > 0 && (currentIndex = 0);
    element.style.transform = `translateX(${currentIndex}em)`;
  }
}

export function playChillToggle (type, element) {

  if (type === 'next' || type === 'previous') {
    playNchillLists.forEach((element, i) => slideCalulate(type, element, i));
  }

  // if (type === 'play') {
  //   if (audioState.section !== 'playNchill') {
  //     audioState.section = 'playNchill';
  //     createList('default');
  // }

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
  topSectionContainer = document.querySelector('.js-top-section');
  addStyleSheets();
  playNchillHTML(samples);
  updateNewLists();
  updateEventListeners();
  homeSettings();
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
}

currentPage.includes('home') && updateSummary();
