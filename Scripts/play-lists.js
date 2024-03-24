//  JSON DATA
import samples from '../Data/Samples.json';

// //  SUMMARY
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playerTapeSummary from './Shared/player-tape.js';
import playlistAddNewSummary from './Shared/playlist-add-new.js';

//  SHARED
import {audioState, userAction} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {
  pageSelectUpdate, 
  updateNavCover, updateTimer
} from './Shared/nav.js';
import {playlistAddNewToggle} from './Shared/playlist-add-new.js';

//  UTILS
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
let playListStyle;

//  Playlist Elements Section
let topSectionContainer;
let addPlaylistButtonElement;
let playListElement;
let playListLists;
let playListCoverElement;
let currentPlaylistContainer;
let currentPlaylistNameElement;
let currentPlaylistLists;
let currentPlaylistListsTitle;
let favouritesListElement;
let favouritesCoverElement;
let favouritesTitleElement;


function playListSettings () {
  audioState.screen = 'Playlists';
  audioState.section === "" && (audioState.section = 'playNchill');
  audioState.playList = playNchillPlaylist;
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

async function addStyleSheets() {
  generalSyle = await import('../Styles/Shared/general.scss');
  animationStyle = await import('../Styles/Shared/animation.scss');
  navStyle = await import('../Styles/Shared/nav.scss');
  headerStyle = await import('../Styles/Shared/header.scss');
  playerTapeStyle = await import('../Styles/Shared/player-tape.scss');
  addToPlaylistStyle = await import('../Styles/Shared/playlist-add-new/add-to-playlist.scss');
  newPlaylistStyle = await import('../Styles/Shared/playlist-add-new/new-playlist.scss');
  sharedPlaylistStyle = await import('../Styles/Shared/playlist-add-new/shared.scss');
  playListStyle = await import('../Styles/play-lists.scss');
}

function updateSelectors() {
  topSectionContainer = document.querySelector('.js-top-section');
  addPlaylistButtonElement = document.querySelector('.js-plus-icon');
  addPlaylistButtonElement.addEventListener('click', () => playlistAddNewToggle('open-new'));
  playListElement = document.querySelector('.js-music-list-container');
  currentPlaylistNameElement = document.querySelector('.js-current-playlist-name');
  currentPlaylistContainer = document.querySelector('.js-list-selection');
}

function addPlayListsSelectors () {
  playListLists = document.querySelectorAll('.js-music-list');
  playListCoverElement = document.querySelectorAll('.js-cover');
  playListLists.forEach(list => {
    const {playlistId} = list.dataset;

    playlistId === 'add' ? 
    list.addEventListener('click', () => playlistAddNewToggle('open-new')) : 
    list.addEventListener('click', () => userAction('switch playlist', false, Number(playlistId) ));
    list.addEventListener('mouseenter', () => cardSpread(list, playlistId, 'out'));
    list.addEventListener('mouseleave', () => cardSpread(list, playlistId, 'in'));

  });

  favouritesListElement = document.querySelector('.js-music-list-favourites');
  favouritesCoverElement = document.querySelector('.js-cover-favourites');
  favouritesTitleElement = document.querySelector('.js-title-favourites');
}

function addPlayListsCovers () {
  playListLists.forEach(element => {
    const {playlistId} = element.dataset
    audioState.playLists.forEach(list => {
      const {playList} = list;
      let cover2;
      let cover3;
  
      playList.list.forEach((id, i) => {
        i === 1 && samples.forEach(sample => sample.id === id && (cover2 = sample.cover));
        i === 2 && samples.forEach(sample => sample.id === id && (cover3 = sample.cover));
      })

      if (Number(playlistId) === list.id) {
        element.style.setProperty('--playList-cover-2', `url('${cover2 || '' }')`);
        element.style.setProperty('--playList-cover-3', `url('${cover3 || '' }')`);
      } 
    })  
  })
}

function addCurrentListsSelectors() {
  currentPlaylistListsTitle = document.querySelectorAll('.js-current-section-audio-title');
  currentPlaylistLists = document.querySelectorAll('.js-playlist-samples');
  currentPlaylistLists.forEach(
    sample => sample.addEventListener(
      'click', () => userAction('play', sample)
    )
  );
}

function playListsHTML () {
  let html = '';

  audioState.playLists.forEach(list => {
    const {playList} = list;
    let cover1;
  
    playList.list.forEach((id, i) => {
      i === 0 && samples.forEach(sample => sample.id === id && (cover1 = sample.cover));
    })
    
    html += 
    `
      <li 
        class="js-music-list small-card ${playList.name === 'Favourites' && 'js-music-list-favourites'}"
        data-playlist-id="${list.id}"
      >
        <img 
          class="cover js-cover ${playList.name === 'Favourites' && 'js-cover-favourites'}" 
          src="${cover1 || '/Img/Default/playlist-default.jpg'}"
          data-cover-id="${list.id}"
        >
        <div class="title ${playList.name === 'Favourites' && 'js-title-favourites'}">
          <h3>${playList.name}</h3>
          <h3>(${playList.totalTracks} tracks)</h3>
        </div>
      </li>
    `;
  })

  html += 
  `
    <li 
    class="js-music-list add"
    data-playlist-id="add"
    >
    </li>
  `;
  
  playListElement.innerHTML = html;
}

function currentListHTML () {
  const {length} = audioState.playList.list;
  const {playList} = audioState;
  let html = '';

  const currentListName = () => {
    if (currentPlaylistNameElement.innerText !== playList.name) {
      currentPlaylistNameElement.style.opacity = '0';
      setTimeout(() => {
        currentPlaylistNameElement.textContent = playList.name;
        currentPlaylistNameElement.style.opacity = '1';
      }, 300);
    }
  }

  playList.list.forEach(sampleID => {
    let matchedSample;
    
    samples.forEach(sample => sample.id === sampleID && (matchedSample = sample));
    matchedSample && (
      html += 
      `
        <li class="js-playlist-samples animate slideUp" data-sample-id="${matchedSample.id}">
          <div class="cover pause-icon">
            <img src="${matchedSample.cover || 'Img/Default/Playlist-emtpy-default.jpg'}"></img>
          </div>
          <h3 class="title js-current-section-audio-title">
            ${matchedSample.artistName} - ${matchedSample.album}
          </h3>
        </li>
      `
    );  
  });
  
  length === 0 && (
    html =
    `
      <li class="animate slideUp">
        <div class="cover">
          <img src="/Img/Default/Playlist-emtpy-default.jpg"></img>
        </div>
        <h3 class="title js-current-section-audio-title">
          No Songs are currently Added
        </h3>
      </li>

    `
  );
  
  currentPlaylistContainer.innerHTML = html;
  currentListName();
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

let currentIndex = 0;
function slideCalulate (direction, element, i) {  
  if (direction === 'next') {
    i === 0 && (currentIndex -= 37.2);

    currentIndex < 
    (-1 * calAndConvTotalWidthToEM(playListElement) + 
    calAndConvTotalWidthToEM(topSectionContainer)) && 
    (currentIndex = -1 * calAndConvTotalWidthToEM(playListElement) + 
    calAndConvTotalWidthToEM(topSectionContainer));

    element.style.transform = `translateX(${currentIndex}em)`;
  } else {
    i === 0 && (currentIndex += 37.2);
    currentIndex > 0 && (currentIndex = 0);
    element.style.transform = `translateX(${currentIndex}em)`;
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

  const styleWhenPlay = () => {
    currentPlaylistLists.forEach(sample => {
      if (getSampleID('element', sample) === audioState.sampleId) {
        sample.style.setProperty('--before-opacity', '1');
        sample.style.setProperty('--text-color', 'white');
        sample.style.setProperty('--background-change', 'linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgb(48, 48, 48) 50%, rgba(255, 255, 255, 0) 100%)'); 
      } 
    });
  }

  if (action === 'next' || action === 'previous') {
    playListLists.forEach((element, i) => slideCalulate(action, element, i));
  }

  if (action === 'change icon') {

    if (audioState.state === 'pause') {
      styleWhenPause();
    } else if (audioState.state === 'play') {   
      styleWhenPause();
      styleWhenPlay();
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

  if (action === 'update playlists HTML') {
    playListsHTML();
    addPlayListsSelectors();
    addPlayListsCovers();
  }
}
      
async function updateSummary() {
  updateSelectors();
  await addStyleSheets();
  playListSettings();
  playListsHTML();
  addPlayListsSelectors();
  addPlayListsCovers();
  currentListHTML();
  addCurrentListsSelectors();
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
  playlistAddNewSummary();
}

currentPage.includes('play-lists') && updateSummary();

