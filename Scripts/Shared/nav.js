import {
  navButtonElements, toggleButtonElement, 
  navContainerElement, toggleButtonArrowElement,
  navCoverElement, audioState, timerElement,
  userAction, newPlaylistButtonElement
} from './general.js';

import {updatePlayerTape, updateAudioTimeTape} from './player-tape.js';

import {playlistAddNewToggle} from './playlist-add-new.js';

import {getSample} from '../Utils/sample.js';
import {getSampleDuration, startTimer, pauseTimer, resetTimer, currentTime, updateSampleDuration} from '../Utils/timer.js';
import padZero from '../Utils/padZero.js';
export let toggleButton = true;

function navSummary() {

  navButtonElements.forEach(button => {
    button.addEventListener('click', () => {
      const {pageName} = button.dataset;
      window.location.href.includes(pageName) || ( window.location.href = pageName);
    });
  });

  toggleButtonElement.addEventListener('mouseenter', () => {
    navContainerElement.classList.add('shift--right');
  });

  toggleButtonElement.addEventListener('mouseleave', () => {
    navContainerElement.classList.remove('shift--right');
  });

  toggleButtonElement.addEventListener('click', toggleButtonUpdate);
  
  newPlaylistButtonElement.addEventListener('click', () => playlistAddNewToggle('open-new'));
}

export default navSummary;


function toggleButtonUpdate () {
  toggleButton = !toggleButton;
  navContainerElement.classList.add('animate');
  toggleButtonArrowElement.classList.add('animate');
  updatePlayerTape('width', toggleButton);

  if (toggleButton) {
    navContainerElement.classList.add('slideInNav');
    navContainerElement.classList.remove('slideOutNav');
    
    toggleButtonArrowElement.classList.add('rotate180deg');
    toggleButtonArrowElement.classList.remove('rotate180degReversed');
    
    toggleButtonElement.classList.add('invert');

  } else {
    navContainerElement.classList.add('slideOutNav');
    navContainerElement.classList.remove('slideInNav');

    toggleButtonArrowElement.classList.add('rotate180degReversed'); 
    toggleButtonArrowElement.classList.remove('rotate180deg');

    toggleButtonElement.classList.remove('invert');
  }

} 

export function pageSelectUpdate () {
  if (toggleButton) {
    navContainerElement.classList.add('slideInNav');
    toggleButtonArrowElement.classList.add('rotate180deg');
    toggleButtonElement.classList.add('invert');

  } else {
    navContainerElement.classList.add('slideInNav');
    toggleButtonArrowElement.classList.add('rotate180deg');

    navContainerElement.classList.add('slideOutNav');
    toggleButtonArrowElement.classList.add('rotate180degReversed'); 
  }
}


export function updateNavCover(type) {
  const {backgroundImage} = navCoverElement.style;

  if (type === 'list empty' && backgroundImage.includes('Playlist-emtpy-default.jpg')) {
    return;
  } 
  
  if (type === 'list empty') {
    navCoverElement.style.opacity = '0';
    setTimeout(() => {
      navCoverElement.style.opacity = '1';
      navCoverElement.style.backgroundImage = `url('/Img/Default/Playlist-emtpy-default.jpg')`;
    }, 150);
    return;
  }  

  if (navCoverElement.style.backgroundImage.includes(getSample().cover)) {
    return;
  }

  navCoverElement.style.opacity = '0';
  setTimeout(() => {
    navCoverElement.style.opacity = '1';
    navCoverElement.style.backgroundImage = `url('${getSample().cover}')`;
  }, 150);
  
}

let timerId;
export function updateTimer (type) {
  if (type === 'list empty') {
    clearInterval(timerId);
    pauseTimer();
    resetTimer();
    timerElement.innerText = `
      -- : -- / -- : --
    `;
    return
  }

  type === 'new audio' && resetTimer();
  type === 're audio' && resetTimer();
  audioState.state === 'pause' && pauseTimer();  
  audioState.state === 'play' && startTimer();
  updateSampleDuration(audioState.audio);
  getSampleDuration();

  if (type === 'new audio' || type ==='re audio') {
    timerElement.style.opacity = '0';
    setTimeout(() => {
      timerElement.style.opacity = '1';
    } , 500);
  }

  updateAudioTimeTape();
  clearInterval(timerId);

  timerId = setInterval(() => {
    if (currentTime.totalTime >= Math.floor(getSampleDuration().durationInSeconds)) {
      clearInterval(timerId);
      userAction('audio finished');
    } 
    timerElement.innerText = 
    `
      ${currentTime.minutes} : ${currentTime.secondsLeft}${currentTime.secondsRight} / ${getSampleDuration().minutes} : ${padZero(getSampleDuration().seconds)}
    `;
  }, 500);

  setTimeout(() => 
    audioState.state === 'pause' && clearInterval(timerId)
  , 1000);  
}