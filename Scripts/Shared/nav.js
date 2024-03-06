import {
  navButtonElements, toggleButtonElement, 
  navContainerElement, toggleButtonArrowElement,
  navCoverElement, audioState, timerElement,
  userAction
} from './general.js';
import {updatePlayerTape, updateAudioTimeTape} from './player-tape.js';
import {getSample} from '../Utils/sample.js';
import {getSampleDuration, startTimer, pauseTimer, resetTimer, currentTime, updateSampleDuration} from '../Utils/timer.js';
// import playerTapeSummary from './player-tape.js';

export let toggleButton = true;

function navSummary() {

  navButtonElements.forEach(button => {
    button.addEventListener('click', () => {
      const pageName = button.dataset.pageName;
      pageName === "Home" && (window.location.href = 'home.html');
      pageName === "All Songs" && (window.location.href = 'all-songs.html');
      pageName === "Albums" && (window.location.href = 'albums.html');
      pageName === "Artists" && (window.location.href = 'artists.html');
      pageName === "Favourites" && (window.location.href = 'favourites.html');
      pageName === "Playlists" && (window.location.href = 'play-lists.html');
    });
  });

  toggleButtonElement.addEventListener('mouseenter', () => {
    navContainerElement.classList.add('shift--right');
  });

  toggleButtonElement.addEventListener('mouseleave', () => {
    navContainerElement.classList.remove('shift--right');
  });

  toggleButtonElement.addEventListener('click', toggleButtonUpdate);

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


export function updateNavCover() {
  if (getSample()) {
    navCoverElement.style.opacity = '0';
    setTimeout(() => {
      navCoverElement.style.opacity = '1';
      navCoverElement.style.backgroundImage = `url('${getSample().cover}')`;
    }, 150);
  } 
}

let timerId;
export function updateTimer (type) {
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
    getSampleDuration().seconds < 10 && (timerElement.innerText = `
    ${currentTime.minutes} : ${currentTime.secondsLeft}${currentTime.secondsRight} / ${getSampleDuration().minutes} : 0${getSampleDuration().seconds}
    `);
    getSampleDuration().seconds >= 10 && (timerElement.innerText = `
    ${currentTime.minutes} : ${currentTime.secondsLeft}${currentTime.secondsRight} / ${getSampleDuration().minutes} : ${getSampleDuration().seconds}
    `);
  }, 500);

  setTimeout(() => 
    audioState.state === 'pause' && clearInterval(timerId)
  , 1000);  
}