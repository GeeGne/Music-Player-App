import {playerTapeElement, expandArrowElement, 
  pausePlayElement, songTitle, audioState,
  playNextElement, playPreviousElement, userAction,
  audioTimeTapeElement, repeatElement, shuffleElement, favouriteElement
} from './general.js';

import {updateMarginMain, playChillToggle, playNchillLists} from '../home.js';
import {currentPlaylistToggle} from '../play-lists.js';

import {toggleButton, updateTimer} from './nav.js';
import {getSample, getSampleID} from '../Utils/sample.js';
import {startTimer, pauseTimer, currentTime, getSampleDuration} from '../Utils/timer.js';
import {favouritesPlaylist} from '../Utils/playlists.js';


let arrowExpand;
let rotateVal= 0;


  
function playerTapeSummary () {
  expandArrowElement.addEventListener('click', () => updatePlayerTape('expand'));
  pausePlayElement.addEventListener('click', () => userAction('play', 'pause play button'));
  playNextElement.addEventListener('click', () => userAction('play next'));
  playPreviousElement.addEventListener('click', () => userAction('play previous'));
  repeatElement.addEventListener('click', () => userAction('repeat'));
  shuffleElement.addEventListener('click', () => userAction('shuffle'));
  favouriteElement.addEventListener('click', () => userAction('favourite'));
}

export default playerTapeSummary;

export function updatePlayerTape (type, other) {

  if (type === 'expand') {
    arrowExpand = !arrowExpand;
    updateMarginMain(arrowExpand);
    expandArrowElement.style.transform = `rotate(${rotateVal += 180}deg)`;
    if (arrowExpand) {
      playerTapeElement.style.transform = `translateY(0)`;
    } else {
      playerTapeElement.style.transform = `translateY(70%)`;
    }
  }

  if (type === 'pause') {
    pausePlayElement.style.opacity = '0';
    setTimeout(() => {
      pausePlayElement.style.opacity = '1';
      pausePlayElement.src = '/Img/Icons/play_arrow.svg';
    }, 200);
  } else if (type === 'play') {
    pausePlayElement.style.opacity = '0';
    setTimeout(() => {
      pausePlayElement.style.opacity = '1';
      pausePlayElement.src = '/Img/Icons/pause.svg';
    }, 200);
  }

  if (type === 'width') {
    if (other) {
      playerTapeElement.style.width = 'calc(100vw - 15.5em)';
    } else {
      playerTapeElement.style.width = 'calc(100vw - 1.5em)';
    }
  }

  if (type === 'songTitle') {
    getSample() && 
    (songTitle.innerHTML = `
      <h3 class="animate slideOut">${getSample().album}</h3> 
      <h3 class="animate slideOut">${getSample().artistName}</h3>`
    );
  }

  if (type === 'repeat') {

    const repeat = other;

    if (!repeat) {
      
      repeatElement.style.setProperty('--set-opacity', '0');
      setTimeout(() => {
        repeatElement.style.setProperty('--set-opacity', '1');
        repeatElement.src = '/Img/Icons/repeat_on.svg';
      }, 200);
    } else if (repeat === true) {

      repeatElement.style.setProperty('--set-opacity', '0');
      setTimeout(() => {
        repeatElement.style.setProperty('--set-opacity', '1');
        repeatElement.src = '/Img/Icons/repeat_on_one.svg';
      }, 200);

    } else if (other = 'on-one') {
      
      repeatElement.style.setProperty('--set-opacity', '0');
      setTimeout(() => {
        repeatElement.style.setProperty('--set-opacity', '0.7');
        repeatElement.src = '/Img/Icons/repeat.svg';
      }, 200);
    }
  }

  if (type === 'shuffle') {

    const shuffle = other;
    if (shuffle) {
      shuffleElement.style.setProperty('--set-opacity', '0');
      setTimeout(() => {
        shuffleElement.style.setProperty('--set-opacity', '1');
        shuffleElement.src = '/Img/Icons/shuffle_on.svg';
      }, 200);
    } else {
      
      shuffleElement.style.setProperty('--set-opacity', '0');
      setTimeout(() => {
        shuffleElement.style.setProperty('--set-opacity', '0.7');
        shuffleElement.src = '/Img/Icons/shuffle.svg';
      }, 200);
    }
  }

  if (type === 'favourite') {
    let matchedID;
    favouritesPlaylist.list.forEach(id => id === audioState.sampleId && (matchedID = true))

    if (matchedID) {

      if (other === 'motion') {
        favouriteElement.style.setProperty('--set-opacity', '0');
        setTimeout(() => {
          favouriteElement.style.setProperty('--set-opacity', '1');
          favouriteElement.src = '/Img/Icons/favourite_added.svg';
        }, 200);
      } else {
        favouriteElement.style.setProperty('--set-opacity', '1');
        favouriteElement.src = '/Img/Icons/favourite_added.svg';
      }
      
    } else {
      if (other === 'motion') {
        favouriteElement.style.setProperty('--set-opacity', '0');
        setTimeout(() => {
          favouriteElement.style.setProperty('--set-opacity', '0.7');
          favouriteElement.src = '/Img/Icons/favourite.svg';
        }, 200);
      } else {
        favouriteElement.style.setProperty('--set-opacity', '0.7');
        favouriteElement.src = '/Img/Icons/favourite.svg';
      }
    }
  }

  if (type === 'list empty') {

    if (pausePlayElement.src.includes("play_arrow.svg")) {
     
    } else {
      pausePlayElement.style.opacity = '0';
      setTimeout(() => {
        pausePlayElement.style.opacity = '1';
        pausePlayElement.src = '/Img/Icons/play_arrow.svg';
      }, 200);
    }

    songTitle.innerHTML = `
      <h3 class="animate slideOut">--</h3> 
      <h3 class="animate slideOut">--</h3>
    `;

  }
}

let timerId;
export function updateAudioTimeTape () {
  timerId = setInterval(() => {
    audioTimeTapeElement.style.width = `${(currentTime.totalTime * 100) / Math.floor(getSampleDuration().durationInSeconds)}%`;
    currentTime.totalTime >= Math.floor(getSampleDuration().durationInSeconds) && clearInterval(timerId);
  }, 1000);
}
