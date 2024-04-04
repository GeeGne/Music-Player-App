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
import {audioState, userAction} from './Shared/general.js';
// import {updatePlayerTape} from './Shared/player-tape.js';
import {pageSelectUpdate, updateNavCover, updateTimer} from './Shared/nav.js';

//  UTILS
import calAndConvTotalWidthToEM from './Utils/lenghtCal.js';
// import {getSampleID, getSample} from './Utils/sample.js';
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
// let favouritesImageElement;
// let totalSongsElement;
let shuffleButtonElement;
// let addFavButtonElement;
// let favouritesListsElements;
// let favouritesCoversElements;

// function favouritesSettings () {
//   audioState.screen = 'Favourites';
//   audioState.section === "" && (audioState.section = 'favourites');
//   // favouritesPlaylist.updatePlaylist('list', 20);
//   // favouritesPlaylist.updatePlaylist('list', 7);
//   // favouritesPlaylist.updatePlaylist('list', 14);
//   audioState.playList = favouritesPlaylist;
//   if (audioState.playList.list.length !== 0) {
//     audioState.sampleId = getSampleID();
//     audioState.state = 'pause';
//     audioState.audio = new Audio(getSample().sampleLocation);
//     updateTimer('new audio');
//     updateNavCover();
//     updatePlayerTape('songTitle');
//     updatePlayerTape('expand');
//     updatePlayerTape('pause');
//     updatePlayerTape('favourite');
//   } else {
//     audioState.state = 'pause';
//     updatePlayerTape('expand');
//     updateTimer('list empty');
//     updateNavCover('list empty');
//     updatePlayerTape('list empty');
//   }
// }

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
}

function updateArtistsSelector () {
  artistsListsElements = document.querySelectorAll('.js-artist-box');
}

// function updateListeners () {
//   shuffleButtonElement.addEventListener('click', () => userAction('shuffle', shuffleButtonElement, 'button'));
//   addFavButtonElement.addEventListener('click', () => favouritesToggle('add'));
//   favouritesImageElement.addEventListener('click', () => userAction('play', 'pause play button'));
// }

// function addFavouritesSelectors() {
//   favouritesListsElements = document.querySelectorAll('.js-list');
//   favouritesListsElements.forEach(
//     sample => sample.addEventListener(
//       'click', () => listType(sample)
//     )
//   );

//   favouritesCoversElements = document.querySelectorAll('.js-cover-container');
// }

let currentIndex = 0;
function slideCalculate (direction) {
  const marginWidthPX = 48;
  const artistCoverWidthEM = 22;
  const topSectionWidthEM = calAndConvTotalWidthToEM(topSectionElement, -1 * marginWidthPX);  
  const artistsContainerWidthEM = calAndConvTotalWidthToEM(artistsContainerElement);
  const scrollWidthEM = topSectionWidthEM > 47 ? topSectionWidthEM / 2 : artistCoverWidthEM;

  if (direction === 'next') {
    currentIndex -= scrollWidthEM;
    currentIndex < (-1 * artistsContainerWidthEM + topSectionWidthEM) && 
    (currentIndex = -1 * artistsContainerWidthEM + topSectionWidthEM); 
  } else { 
    currentIndex += scrollWidthEM;
    currentIndex > 0 && (currentIndex = 0);
  }
}

function artistsArray () {
  let artistsNameReference = [];
  samples.forEach(samples =>{
    const {artistName} = samples;
    const strLowerCase = artistName.toLowerCase();
    const strLowerCaseArray = strLowerCase.split(strLowerCase.includes('&') ? ' & ' : ' x ');
    const strLowerCaseNoSpaceArray = strLowerCaseArray.map(string => string.replace(/\s/g, ''));
    artistsNameReference = [...artistsNameReference, strLowerCaseNoSpaceArray];
  })

  let repetetiveStrFilter = [];
  artistsNameReference.forEach(array => {
    array.forEach(artist => {
      let matchedItem;
      repetetiveStrFilter.forEach(str => str === artist && (matchedItem = artist))
      matchedItem || (repetetiveStrFilter =[...repetetiveStrFilter, artist])
    });
  });

  audioState.artists = artistsNameReference = repetetiveStrFilter;
  console.log({artistsNameReference}, audioState.artists);
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
  const {artists} = audioState;
  let html = ``;

  artists.forEach((artist, i) => {
    let matchedItem;
    artistsData.forEach(artistData =>{
      let {artistName} = artistData;
      const strLowerCase = artistName.toLowerCase();
      const strNoSpaceLowerCase = strLowerCase.replace(/\s/g, '');
      artistName = strNoSpaceLowerCase;

      artist === artistName && (matchedItem = artistData)
    });

    matchedItem && (
      html +=
      `
        <li 
          class="artist-box ${i === 0 && 'filler-start selected'} ${i === artists.length - 1 && 'filler-end'} js-artist-box"
          data-artist-name="${artist}"
        >
          <div class="title-box">
            <h3>${matchedItem.artistName}</h3>
            <h3>Total songs</h3>
          </div>
          <img src="${matchedItem.artistCover || '/Img/Default/Artist-default.jpg'}">
        </li>
      `
    )
    console.log(matchedItem);
  });

  artistsContainerElement.innerHTML = html;

}

// let timerID;
export function artistsToggle (action, element) {
  const updateSelectedArtist = (direction) => {
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
      const artistName = element.dataset;
      if (i === targetedIndex) {
        audioState.selectedArtist = artistName;
        element.classList.add('selected');
      }
    });
  }
  // const styleWhenPause = () => {
  //   favouritesListsElements.forEach(sample => {
  //     sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0');
  //     sample.style.setProperty('--text-color', 'black');
  //   });

  //   favouritesCoversElements.forEach(sample => 
  //     sample.style.setProperty('--before-opacity', '0')
  //   );

  //   favouritesImageElement.classList.add('paused');
  // }

  // const styleWhenPlay = () => {
  //   favouritesListsElements.forEach(sample => {
  //     if (getSampleID('element', sample) === audioState.sampleId) {
  //       sample.style.setProperty('--background-change', 'rgba(0, 0, 0, 0.6');
  //       sample.style.setProperty('--text-color', 'white');
  //     } 
  //   });

  //   favouritesCoversElements.forEach(cover =>
  //     getSampleID('element', cover) === audioState.sampleId && 
  //     cover.style.setProperty('--before-opacity', '1')
  //   );

  //   favouritesImageElement.classList.remove('paused');
  // }

  // if (action === 'change icon') {

  //   if (audioState.state === 'pause') {
  //     styleWhenPause();
  //   } else if (audioState.state === 'play') {   
  //     styleWhenPause();
  //     styleWhenPlay()
  //   }  
  // }

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
    artistsListsElements.forEach(element => element.style.transform = `translateX(${currentIndex}em)`);
    updateSelectedArtist(action);
  }
}

// function listType(list) {
//   const {listType} = list.dataset;
//   const sampleId = Number(list.dataset.sampleId);

//   if (listType === 'play') {
//     userAction('play', list);
//   } else if (listType === 'add') {
//     favouritesPlaylist.updatePlaylist('list',sampleId);
//     list.classList.toggle('checked');
//   } else if (listType === 'empty') {
//     favouritesToggle('add')
//   }
// }
      
async function updateSummary() {
  updateSelectors();
  await addStyleSheets();
  artistsArray();
  artistsHTML();
  updateArtistsSelector();
//   favouritesSettings();
//   updateListeners();
//   favouritesHTML();
//   addFavouritesSelectors();;
  generalSummary();
  navSummary();
  pageSelectUpdate();
  playerTapeSummary();
  playlistAddNewSummary();
}

currentPage.includes('artists') && updateSummary();

