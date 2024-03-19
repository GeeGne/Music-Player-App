import {updateTimer} from '../Shared/nav.js'
export let durationInSeconds;

export function updateSampleDuration (audio) {
  audio.addEventListener(
    'loadedmetadata', () => durationInSeconds = audio.duration
  );
} 

export function getSampleDuration () {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds - minutes * 60) ;
  
  return {minutes, seconds, durationInSeconds};
} 

export let currentTime = {
  secondsRight: 0,
  secondsLeft: 0,
  minutes: 0,
  totalTime: 0
};

let timerId;
export function startTimer () {
  clearInterval(timerId);
  timerId = setInterval(() => {
    currentTime.totalTime += 1;
    currentTime.secondsRight += 1;
    if (currentTime.secondsRight === 10) {
      currentTime.secondsRight = 0;
      currentTime.secondsLeft += 1;
    }
    if (currentTime.secondsLeft === 6) {
      currentTime.secondsLeft = 0
      currentTime.minutes += 1;
    }
    if (currentTime.totalTime >= Math.floor(durationInSeconds)) {
      pauseTimer();

    }

    console.log('startTimerCheck')
  }, 1000);
}


export function pauseTimer () {
  clearInterval(timerId);
}

export function resetTimer () {
  currentTime = {
    secondsRight: 0,
    secondsLeft: 0,
    minutes: 0,
    totalTime: 0
  } 
}