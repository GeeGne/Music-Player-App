//  JSON DATA
import samples from '../Data/Samples.json';

//  ARISTS DATA
import artistsData from '../Data/Artists.json';

//  SUMMARY
import generalSummary from './Shared/general.js';
import navSummary from './Shared/nav.js';
import playerTapeSummary from './Shared/player-tape.js';
import playlistAddNewSummary from './Shared/playlist-add-new.js';

//  SHARED
import {audioState, userAction, updateAudioState} from './Shared/general.js';
import {updatePlayerTape} from './Shared/player-tape.js';
import {pageSelectUpdate, updateNavCover, updateTimer} from './Shared/nav.js';

//  UTILS
import calAndConvTotalWidthToEM from './Utils/lenghtCal.js';
import {getSampleID, getSample} from './Utils/sample.js';
// import {favouritesPlaylist} from './Utils/playlists.js';

//  Current Screen
const currentPage = window.location.href;

//  Pick Artist Button
let pickArtistButton;

//  CSS Styles
let generalSyle;
let animationStyle;
let navStyle;
let headerStyle;
let playerTapeStyle;
let addToPlaylistStyle;
let newPlaylistStyle;
let sharedPlaylistStyle;
let artistsStyle;

//  Artists Elements Section
let rightSideElement;
let topSectionElement;
let artistsContainerElement;
let artistsListsElements;
let shuffleButtonElement;
let pickArtistButtonElement;
let artistSongsContainerElement;
let artistSongsElements;
let artistSongsCoverElements;
let addToPlaylistButtonElements;

function artistsSettings () {
  audioState.screen = 'Artists';
  audioState.section === "" && (audioState.section = 'Artists');

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
  artistsStyle = await import('../Styles/artists.scss');
}

function updateSelectors () {
  rightSideElement = document.querySelector('.js-right-side');
  topSectionElement = document.querySelector('.js-top-section');
  artistsContainerElement = document.querySelector('.js-artists-container');
  pickArtistButtonElement = document.querySelector('.js-pick-artist-button')
  shuffleButtonElement = document.querySelector('.js-shuffle-button');
  artistSongsContainerElement = document.querySelector('.js-list-container');
}

function updateListeners () {
  shuffleButtonElement.addEventListener('click', () => userAction('shuffle', shuffleButtonElement, 'button'));
  pickArtistButtonElement.addEventListener('click', () => artistsToggle('pick artist'));
}

let currentTranslateX = 0;
function slideCalculate (direction) {
  const bodyWidthPX = document.body.scrollWidth;
  const marginWidthPX = 48;
  const artistCoverWidthEM = 22;
  const topSectionWidthEM = calAndConvTotalWidthToEM(topSectionElement, bodyWidthPX > 665 && -1 * marginWidthPX);  
  const artistsContainerWidthEM = calAndConvTotalWidthToEM(artistsContainerElement);
  const scrollWidthEM = topSectionWidthEM > 44 ? topSectionWidthEM / 2 : artistCoverWidthEM;

  if (direction === 'next') {
    currentTranslateX -= scrollWidthEM;
    currentTranslateX < (-1 * artistsContainerWidthEM + topSectionWidthEM) && 
    (currentTranslateX += scrollWidthEM); 
  } else { 
    currentTranslateX += scrollWidthEM;
    currentTranslateX > 0 && (currentTranslateX = 0);
  }
}

let observerTimerID;
function renderArtistsWhenWidthChanges () {     
  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      // console.log('Element width changed:', entry.contentRect.width);
      clearTimeout(observerTimerID);
      setTimeout(() => artistsToggle('re toggle to the selected artist'), 300);
    }
  });
  observer.observe(topSectionElement);
}

function artistsHTML () {

  const updateArtistsSelector = () => {
    artistsListsElements = document.querySelectorAll('.js-artist-box');
  }

  const updateSelectedArtist = () => {
    artistsListsElements.forEach(element => {
      const {artistName} = element.dataset;
      element.classList.contains('selected') && (audioState.selectedArtist = artistName);
    })
  }

  const {artists} = audioState;
  let html = ``;

  artists.forEach((artist, i) => {
    const {artistData} = artist;
    const {name} = artist;
    const {totalTracks} = artist;

    html +=
    `
      <li 
        class="artist-box ${i === 0 && 'filler-start selected'} ${i === artists.length - 1 && 'filler-end'} js-artist-box"
        data-artist-name="${name}"
      >
        <div class="title-box">
          <h3>${artistData.artistName}</h3>
          <h3>Total Songs ${totalTracks}</h3>
        </div>
        <img src="${artistData.artistCover || '/Img/Default/Artist-default.jpg'}">
      </li>
    `
  });
  
  artistsContainerElement.innerHTML = html;
  updateArtistsSelector();
  updateSelectedArtist();
  updateAudioState('artist');
}

function artistSongsHTML (animation) {

  const updateArtistSongsSelectorsAndListeners = () => {
    artistSongsElements = document.querySelectorAll('.js-list');
    artistSongsElements.forEach(
      sample => sample.addEventListener(
        'click', () => listType(sample)
      )
    );
  
    artistSongsCoverElements = document.querySelectorAll('.js-cover-container');
    addToPlaylistButtonElements = document.querySelectorAll('.js-add-to-playlist-button');
    addToPlaylistButtonElements.forEach(element => {
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        userAction('add song to playlist', element)
      });
    });
  }

  const songsHTML = () => {
    const {artists} = audioState;
    const {selectedArtist} = audioState;

    let matchedList;
    artists.forEach(artist => {
      const {name} = artist
      const {list} = artist

      name.includes(selectedArtist) && (matchedList = list)
    })
  
    let html = '';
    matchedList.forEach(artistList => {
      let matchedItem;

      samples.forEach(sample => artistList === sample.id && (matchedItem = sample))
  
      matchedItem && (
        html += 
        `
          <li 
            class="list js-list animate ${animation === 'slide down' ? 'slideDown' : 'fadeIn'}"
            data-list-type="play"
            data-sample-id="${matchedItem.id}"
            >
            <div 
              class="cover-container js-cover-container" 
              data-sample-id="${matchedItem.id}"
            >
              <img src="${matchedItem.cover}">
            </div>
            <h3>${matchedItem.artistName} - ${matchedItem.album}</h3>
            <button 
              class="add-to-playlist-button js-add-to-playlist-button"
              data-sample-id="${matchedItem.id}"
            />
          </li>
        `
      );
    })
    artistSongsContainerElement.innerHTML = html;
    updateArtistSongsSelectorsAndListeners();
  }

  const artistsHTML = () => {
    const {artists} = audioState;
  
    let html = '';
    artists.forEach(artist => {
      const {artistName} = artist.artistData;
      const {artistCover} = artist.artistData;
      const {name} = artist;

      html += 
      `
        <li 
          class="list js-list"
          data-list-type="pick"
          data-name-reference="${name}"
          >
          <div 
            class="cover-container js-cover-container" 
          >
            <img src="${artistCover || '/Img/Default/Artist-default.jpg'}">
          </div>
          <h3>${artistName}</h3>
        </li>
      `;
    })
    artistSongsContainerElement.innerHTML = html;
    updateArtistSongsSelectorsAndListeners();
  }

  pickArtistButton ? artistsHTML() : songsHTML();
}

let pickArtistTimerID;
export function artistsToggle (action, element, other) {

  const updateSelectedArtist = (type) => {
    let sameArtist;
    let targetedIndex;

    if (type === 'next' || type === 'previous') {
      const direction = type;

      artistsListsElements.forEach((element, i) =>{
        if (element.classList.contains('selected')) {
          const lastIndex = artistsListsElements.length - 1;

          targetedIndex = i + (direction === 'next' ? 1 : -1);
          targetedIndex < 0 && (targetedIndex = 0);
          targetedIndex > lastIndex && (targetedIndex = lastIndex);
        }

        element.classList.remove('selected');
      });

      artistsListsElements.forEach((element, i) =>{
        const {artistName} = element.dataset;
        if (i === targetedIndex) {
          element.classList.add('selected');
          audioState.selectedArtist === artistName ? (sameArtist = true) : (audioState.selectedArtist = artistName);
        }
      });
    } else {
      const pickedArtist = type;
      artistsListsElements.forEach(element => element.classList.remove('selected'));
      artistsListsElements.forEach(element =>{
        const {artistName} = element.dataset;

        if (artistName === pickedArtist) {
          element.classList.add('selected');
          audioState.selectedArtist === artistName ? (sameArtist = true) : (audioState.selectedArtist = artistName);
        }
      });
    }

    return sameArtist;
  }

  const toggleBackToArtist = () => {
    currentTranslateX = 0;
    let artistFinderArray = []; 
    
    artistsListsElements.forEach(element => {
      const {artistName} = element.dataset;
      const {selectedArtist} = audioState;

      artistFinderArray = [...artistFinderArray, artistName === selectedArtist];
    })

    let selectedArtist;
    artistFinderArray.forEach(choosed => {
      choosed && (selectedArtist = true);

      if (selectedArtist) {
        return
      } else if (!selectedArtist) {
        slideCalculate('next');
      }
    })
  }

  const pauseFromTheBegenning = () => {
    audioState.audio.pause();
    audioState.state = 'pause';
    audioState.sampleId = getSampleID();
    audioState.audio = new Audio(getSample().sampleLocation);
    updateTimer('new audio');
    updateNavCover();
    updatePlayerTape('songTitle');
    updatePlayerTape('pause');
    updatePlayerTape('favourite');
  }

  const styleWhenPause = () => {
    artistSongsElements.forEach(sample => {
      sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0');
      sample.style.setProperty('--text-color', 'black');
    });

    artistSongsCoverElements.forEach(sample => 
      sample.style.setProperty('--before-opacity', '0')
    );
  }

  const styleWhenPlay = () => {
    artistSongsElements.forEach(sample => {
      if (getSampleID('element', sample) === audioState.sampleId) {
        sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0.6');
        sample.style.setProperty('--text-color', 'white');
      } 
    });

    artistSongsCoverElements.forEach(cover =>
      getSampleID('element', cover) === audioState.sampleId && 
      cover.style.setProperty('--before-opacity', '1')
    );
  }

  const scrollUP = () => {
    rightSideElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  if (action === 'change icon') {

    if (audioState.state === 'pause') {
      styleWhenPause();
    } else if (audioState.state === 'play') {   
      styleWhenPause();
      styleWhenPlay()
    }  
  }

  if (action === 'pick artist') {
    pickArtistButton = !pickArtistButton;

    topSectionElement.classList.toggle('add');
    artistSongsContainerElement.classList.toggle('add');

    clearTimeout(pickArtistTimerID);
    pickArtistButtonElement.style.setProperty('--set-display', 'none');
    pickArtistTimerID = setTimeout(() => pickArtistButtonElement.style.setProperty('--set-display', 'initial'), 500);

    if (other) {
      const nameReference = other;
      const {selectedArtist} = audioState;
      
      if (selectedArtist !== nameReference) {
        updateSelectedArtist(nameReference);
        updateAudioState('artist');
        pauseFromTheBegenning();
        toggleBackToArtist();
        artistsListsElements.forEach(element => element.style.transform = `translateX(${currentTranslateX}em)`);
      }
    }
    artistSongsHTML(other && 'slide down');
    scrollUP();
  }

  if (action === 'next' || action === 'previous') {
    userAction('switch playlist');
    slideCalculate(action);
    artistsListsElements.forEach(element => element.style.transform = `translateX(${currentTranslateX}em)`);
    const sameArtist = updateSelectedArtist(action);
    if (!sameArtist) {
      updateAudioState('artist');
      artistSongsHTML();
      pauseFromTheBegenning();
    }
  }

  if (action === 're toggle to the selected artist') {
    toggleBackToArtist();
    artistsListsElements.forEach(element => element.style.transform = `translateX(${currentTranslateX}em)`);
  }
}

function listType(list) {
  const {listType} = list.dataset;
  const {nameReference} = list.dataset;

  if (listType === 'play') {
    userAction('play', list);
  } else if (listType === 'pick') {
    artistsToggle('pick artist', undefined, nameReference);
  }
}
      
async function updateSummary() {
  updateSelectors();
  updateListeners();
  await addStyleSheets();
  artistsHTML();
  artistSongsHTML();
  artistsSettings();
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
  playlistAddNewSummary();
  renderArtistsWhenWidthChanges();
}

currentPage.includes('artists') && updateSummary();
