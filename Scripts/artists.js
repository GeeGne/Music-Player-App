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
import strToLowerCaseAndNoSpace from './Utils/strToLowerCaseAndNoSpace.js';
import {getSampleID, getSample} from './Utils/sample.js';
// import {favouritesPlaylist} from './Utils/playlists.js';

//  Current Screen
const currentPage = window.location.href;

// //  Add to Fav Button
// let addButton;

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
let topSectionElement;
let artistsContainerElement;
let artistsListsElements;
// let totalSongsElement;
let shuffleButtonElement;
// let addFavButtonElement;
let artistSongsContainerElement;
let artistSongsElements;
let artistSongsCoverElements;

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
  topSectionElement = document.querySelector('.js-top-section');
  artistsContainerElement = document.querySelector('.js-artists-container');
  shuffleButtonElement = document.querySelector('.js-shuffle-button');
  artistSongsContainerElement = document.querySelector('.js-list-container');
}

// function updateListeners () {
//   shuffleButtonElement.addEventListener('click', () => userAction('shuffle', shuffleButtonElement, 'button'));
//   addFavButtonElement.addEventListener('click', () => favouritesToggle('add'));
//   favouritesImageElement.addEventListener('click', () => userAction('play', 'pause play button'));
// }

// function addFavouritesSelectors() {
  // artistSongsElements = document.querySelectorAll('.js-list');
  // artistSongsElements.forEach(
//     sample => sample.addEventListener(
//       'click', () => listType(sample)
//     )
//   );

//   artistSongsCoverElements = document.querySelectorAll('.js-cover-container');
// }

let currentTranslateX = 0;
function slideCalculate (direction) {
  const marginWidthPX = 48;
  const artistCoverWidthEM = 22;
  const topSectionWidthEM = calAndConvTotalWidthToEM(topSectionElement, -1 * marginWidthPX);  
  const artistsContainerWidthEM = calAndConvTotalWidthToEM(artistsContainerElement);
  const scrollWidthEM = topSectionWidthEM > 47 ? topSectionWidthEM / 2 : artistCoverWidthEM;

  if (direction === 'next') {
    currentTranslateX -= scrollWidthEM;
    currentTranslateX < (-1 * artistsContainerWidthEM + topSectionWidthEM) && 
    (currentTranslateX += scrollWidthEM); 
    // (currentTranslateX = -1 * artistsContainerWidthEM + topSectionWidthEM ); 
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

// function favouritesHTML () {
//   const {list} = favouritesPlaylist;
//   const {length} = list;
//   let html = '';

//   if (addButton) {
//     samples.forEach(sample => {
//       let matchedID;
//       list.forEach((id) => 
//         id === sample.id && (matchedID = true)
//       )
      
//       html +=
//       `
//         <li 
//           class="list ${matchedID && 'checked'} js-list"
//           data-list-type="add"
//           data-sample-id="${sample.id}"
//         >
//           <div 
//             class="cover-container js-cover-container" 
//             data-sample-id="${sample.id}"
//           >
//             <img src="${sample.cover}">
//           </div>
//           <h3>${sample.artistName} - ${sample.album}</h3>
//         </li>
//       `
//     });

//     playListElement.innerHTML = html;
//     return;
//   }

//   const totalSongs = () => {
//     totalSongsElement.textContent = `${favouritesPlaylist.totalTracks} Songs`;
//   }

//   list.forEach(sampleID => {
//     let matchedSample;
    
//     samples.forEach(sample => sample.id === sampleID && (matchedSample = sample));

//     matchedSample && (
//       html += 
//       `
//         <li 
//           class="list js-list animate slideDown"
//           data-list-type="play"
//           data-sample-id="${matchedSample.id}"
//           >
//           <div 
//             class="cover-container js-cover-container" 
//             data-sample-id="${matchedSample.id}"
//           >
//             <img src="${matchedSample.cover}">
//           </div>
//           <h3>${matchedSample.artistName} - ${matchedSample.album}</h3>
//         </li>
//       `
//     );  
//   });
  
//   length === 0 && (
//     html =
//     `
//       <li 
//         class="list js-list empty animate slideUp"
//         data-list-type="empty"
//       >
//         <div class="cover-container">
//           <img src="/Img/Default/Playlist-emtpy-default.jpg">
//         </div>
//         <h3>No Songs are currently added</h3>
//       </li>
//     `
//   );
  
//   playListElement.innerHTML = html;
//   totalSongs();
// }

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
    const {nameReference} = artist;
    const {totalTracks} = artist;

    html +=
    `
      <li 
        class="artist-box ${i === 0 && 'filler-start selected'} ${i === artists.length - 1 && 'filler-end'} js-artist-box"
        data-artist-name="${nameReference}"
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

function artistSongsHTML () {

  const updateArtistSongsSelectorsAndListeners = () => {
    artistSongsElements = document.querySelectorAll('.js-list');
    artistSongsElements.forEach(
      sample => sample.addEventListener(
        'click', () => listType(sample)
      )
    );
  
    artistSongsCoverElements = document.querySelectorAll('.js-cover-container');

  }

  const {artists} = audioState;
  const {selectedArtist} = audioState;

  let matchedList;
  artists.forEach(artist => {
    const {nameReference} = artist
    const {list} = artist

    nameReference.includes(selectedArtist) && (matchedList = list)
  })
  
  let html = '';
  matchedList.forEach(artistList => {
    let matchedItem;

    samples.forEach(sample => artistList === sample.id && (matchedItem = sample))
  
    matchedItem && (
      html += 
      `
        <li 
          class="list js-list animate fadeIn"
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
        </li>
      `
    );

  })
  artistSongsContainerElement.innerHTML = html;
  updateArtistSongsSelectorsAndListeners();
}

export function artistsToggle (action, element) {

  const updateSelectedArtist = (direction) => {
    let sameArtist;
    let targetedIndex;

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

  if (action === 'change icon') {

    if (audioState.state === 'pause') {
      styleWhenPause();
    } else if (audioState.state === 'play') {   
      styleWhenPause();
      styleWhenPlay()
    }  
  }

  // if (action === 'list empty') {
  //   favouritesImageElement.classList.add('paused');
  // }

  // if (action === 'add') {
  //   addButton = !addButton;

  //   topSectionElement.classList.toggle('add');
  //   playListElement.classList.toggle('add');

  //   clearTimeout(timerID);
  //   addFavButtonElement.style.setProperty('--set-display', 'none');
  //   timerID = setTimeout(() => addFavButtonElement.style.setProperty('--set-display', 'initial'), 500);

  //   favouritesHTML();
  //   addFavouritesSelectors();
  // }

  // if (action === 'update favourite list') {
  //   favouritesHTML();
  //   addFavouritesSelectors();
  // }

  if (action === 'next' || action === 'previous') {
    slideCalculate(action);
    artistsListsElements.forEach(element => element.style.transform = `translateX(${currentTranslateX}em)`);
    const sameArtist = updateSelectedArtist(action);
    sameArtist || updateAudioState('artist');
    sameArtist || artistSongsHTML();
  }

  if (action === 're toggle to the selected artist') {
    toggleBackToArtist();
    artistsListsElements.forEach(element => element.style.transform = `translateX(${currentTranslateX}em)`);
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
