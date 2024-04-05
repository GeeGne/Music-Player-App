import {currentPlaylistToggle} from '../play-lists.js';

import {playChillToggle} from '../home.js';

import {allSongsToggle} from '../all-songs.js';

import {favouritesToggle} from '../favourites.js';

import {artistsToggle} from '../artists.js';

import {updateTimer, updateNavCover} from './nav.js';

import {updatePlayerTape} from './player-tape.js';

import {playlistAddNewToggle} from './playlist-add-new.js';

import {currentTime} from '../Utils/timer.js';
import {getSample, getSampleID} from '../Utils/sample.js';
import {playNchillPlaylist, favouritesPlaylist, allSongsPlaylist} from '../Utils/playlists.js';
import artistsArray from '../Utils/artistsArray.js';

//  Nav Elements
export const navContainerElement = document.querySelector('.js-nav-container');
export const navButtonElements = document.querySelectorAll('.js-nav-button');
export const navCoverElement = document.querySelector('.js-album-cover');
export const timerElement = document.querySelector('.js-timer');
export const newPlaylistButtonElement = document.querySelector('.js-new-playlist-button');

//  Header Elements
export const toggleButtonElement = document.querySelector('.js-nav-toggle');
export const toggleButtonArrowElement = document.querySelector('.js-nav-toggle-arrow');
const searchInputElement = document.querySelector(' .js-search-input');
const settingsButtonElement = document.querySelector('.js-settings');

//  Main Elements
export const rightArrowElement = document.querySelectorAll('.js-right-arrow');
export const leftArrowElement = document.querySelectorAll('.js-left-arrow');
export const rightSideElement = document.querySelector('.js-right-side')

//  Player-tape Elements
export const playerTapeElement = document.querySelector('.js-player-tape');
export const expandArrowElement = document.querySelector('.js-expand-arrow');
export const pausePlayElement = document.querySelector('.js-pause-play');
export const songTitle = document.querySelector('.js-song-title');
export const playNextElement = document.querySelector('.js-play-next');
export const playPreviousElement = document.querySelector('.js-play-previous');
export const audioTimeTapeElement = document.querySelector('.js-audio-time-tape');
export const repeatElement = document.querySelector('.js-repeat-icon');
export const shuffleElement = document.querySelector('.js-shuffle-icon');
export const favouriteElement = document.querySelector('.js-favourite-icon');

//  Playlist add + new Elements
export const addNewPlaylistContainerElement = document.querySelector('.js-add-new-playlist-container');
export const newListBoxElement = document.querySelector('.js-new-list-box');
export const createListSectionElement = document.querySelector('.js-create-list-section');
export const messageAlertTextElement = document.querySelector('.js-message-alert');
export const newPlaylistInputElement = document.querySelector('.js-new-playlist-input');
export const createButtonElement = document.querySelector('.js-create-button');
export const addListBoxElement = document.querySelector('.js-add-list-box');
export const addToPlaylistContainerElement = document.querySelector('.js-add-to-playlist-container');
export const addToPlaylistToggleElement = document.querySelectorAll('.js-add-to-playlist-toggle');
export const newPlaylistToggleElement = document.querySelectorAll('.js-new-playlist-toggle');
export const addNewPlaylistExitButtonElement = document.querySelector('.js-exit-button');
export const selectedSamplesSection = document.querySelectorAll('.js-selected-samples-section');
export const addSampleButtonElement = document.querySelectorAll('.js-add-sample-button');
export const selectedSamplesContainer = document.querySelectorAll('.js-selected-samples-container');

export let audioState = {
  state: '',
  sampleId: '',
  audio: '',
  section: '',
  screen: '',
  playList: '',
  playLists: [
    { 
      id: 1,
      playList: favouritesPlaylist
    },{
      id: 2,
      playList: playNchillPlaylist
    }
  ],
  artists: artistsArray(),
  selectedArtist: '',
  playListSettings: {
    repeat: false,
    shuffle: false
  }
}

function generalSummary () {
  rightArrowElement.forEach(element => 
    element.addEventListener('click', () => arrowToggle('next', element))
  );
  leftArrowElement.forEach(element => 
    element.addEventListener('click', () => arrowToggle('previous', element))
  );
}

export default generalSummary;


export function userAction(action, element, other) {

  const pauseOrPlay = () => {
    updateAudioState();
    updateTimer();
    updateIcon('change icon');
    updateNavCover();
    updatePlayerTape(audioState.state);
    updatePlayerTape('songTitle');
    updatePlayerTape('favourite');
  }

  const playNewAudio = action => {
    updateAudioState(action, 'new audio', element);
    updateTimer('new audio');
    updateIcon('change icon');
    updateNavCover();
    updatePlayerTape('songTitle');
    updatePlayerTape(audioState.state);
    updatePlayerTape('favourite');
  }

  const restart = action => {
    updateAudioState(action, 're audio');
    updateTimer('re audio');
    updatePlayerTape(audioState.state);
  }

  const playFromBeginning = () => {
    updateAudioState('play from beginning', 'new audio');
    updateTimer('new audio');
    updateIcon('change icon');
    updateNavCover();
    updatePlayerTape('songTitle');
    updatePlayerTape(audioState.state);
    updatePlayerTape('favourite');
  }

  const audioFinished = () => {
    let {repeat} = audioState.playListSettings;
    let {list} = audioState.playList;
    
    if (!repeat && audioState.sampleId === list[list.length - 1]) {
      userAction('play', 'pause play button');
    } else if (!repeat || repeat === true) {
      userAction('play next')
    } else if (repeat === 'on-one') {
      repeat === 'on-one' && userAction('re play');
    }
  }

  const listIsEmpty = () => {
    updateAudioState('list empty');
    updateTimer('list empty');
    updateNavCover('list empty');
    updatePlayerTape('list empty');
    updateIcon('list empty');
  }

  const updateIcon = type => {
    audioState.screen === 'Home' && playChillToggle (type);  
    audioState.screen === 'Playlists' && currentPlaylistToggle(type);
    audioState.screen === 'All Songs' && allSongsToggle(type);
    audioState.screen === 'Favourites' && favouritesToggle(type);
  }

  if (action === 'switch playlist') {
    let {shuffle} = audioState.playListSettings;
    let {playList} = audioState;
    const playListId = other;
    let matchedPlaylist;

    if (shuffle) {
      shuffle = audioState.playListSettings.shuffle = !audioState.playListSettings.shuffle;
      playList.sortList();
      updatePlayerTape('shuffle', shuffle);
    }

    audioState.playLists.forEach(list => list.id === playListId && (matchedPlaylist = list.playList))
    
    if (audioState.playList !== matchedPlaylist) {
      audioState.playList = matchedPlaylist
  
      audioState.screen === 'Playlists' && currentPlaylistToggle('update current playlist HTML');
    }
    audioState.playList.list.length !== 0 && playFromBeginning();
    audioState.playList.list.length !== 0 && currentPlaylistToggle('change icon');
  }

  if (action === 'favourite' && audioState.playList.list.length !== 0 && audioState.sampleId !== "") {
    favouritesPlaylist.updatePlaylist('list', audioState.sampleId);
    updatePlayerTape(action, 'motion');
    audioState.screen === 'Playlists' && currentPlaylistToggle('update favourite list');
    audioState.screen === 'Favourites' && favouritesToggle('update favourite list');
  }
  
  if (audioState.playList.list.length === 0) {
    listIsEmpty();
    return;
  }

  if (action === 'play') {

    if (audioState.state === 'pause') {

      if (element !== 'pause play button' && audioState.sampleId === getSampleID('element', element) || element === 'pause play button') {
        audioState.sampleId === "" ? playFromBeginning() : pauseOrPlay();
        
      } else {
        playNewAudio(action, element);
      }
    } else if (audioState.state === 'play') {

      if (element !== 'pause play button' && audioState.sampleId === getSampleID('element', element) || element === 'pause play button') {
        pauseOrPlay();
      } else {
        playNewAudio(action, element);
      }
    }
  }

  if (action === 'play next' || action === 'play previous' || action === 're play') {

    if (action === 'play previous' && currentTime.totalTime >= 5 || action === 're play') {
      restart(action);
    } else {
      playNewAudio(action);
    }
  }

  if (action === 'audio finished') {
    audioFinished();
  }

  if (action === 'repeat') {

    let {repeat} = audioState.playListSettings;
    if (!repeat) {
      audioState.playListSettings.repeat = !audioState.playListSettings.repeat;
    } else if (repeat === true) {
      audioState.playListSettings.repeat = 'on-one';
    } else if (repeat = 'on-one') {
      audioState.playListSettings.repeat = !audioState.playListSettings.repeat;
    }

    updatePlayerTape(action, repeat);
  }
  
  if (action === 'shuffle') {
    let {shuffle} = audioState.playListSettings;
    let {playList} = audioState;

    if (other === 'button') {
      const {sectionId} = element.dataset;

      sectionId === 'all-songs' && updateAudioState(sectionId, 'new section');
      shuffle = audioState.playListSettings.shuffle = true;
      playList.shuffleList();
      shuffle && updatePlayerTape(action, true);
      setTimeout(playFromBeginning, 500);
    } else {
     shuffle =  audioState.playListSettings.shuffle = !audioState.playListSettings.shuffle;
      shuffle && playList.shuffleList();
      updatePlayerTape(action, shuffle);
    }
  }
}

function arrowToggle (direction, element) {
  const {sectionInfo} = element.dataset;
  sectionInfo === 'play-n-chill' && playChillToggle(direction, element);
  sectionInfo === 'play-list' && currentPlaylistToggle(direction, element);
  sectionInfo === 'playlist-add-new' && playlistAddNewToggle(direction, element);
  sectionInfo === 'artists' && artistsToggle(direction, element);
}

export function updateAudioState (type, action, element) {

  if (type === 'new playlist') {
    const playList = action;
    const {length} = audioState.playLists;
    const id = length + 1;

    audioState.playLists = [...audioState.playLists, {id, playList}];
  } else if (type === 'list empty') {
    audioState.sampleId = "";
    audioState.state = 'pause';
    audioState.audio && audioState.audio.pause();
  } else if (action === 'new section') {
    if (type === 'all songs') {
      audioState.section = 'all-songs';
      audioState.playList = allSongsPlaylist; 
    } 
  } else if (action === 'new audio' || action === 're audio') {
    audioState.audio && audioState.audio.pause();
    if (element) {
      audioState.sampleId = getSampleID('element', element)
    } else if ((type === 'play next') || (type === 'play previous' && currentTime.totalTime <= 5) || (type === 'play from beginning')) {
      audioState.sampleId = getSampleID(type, false);
    }
    audioState.audio = new Audio(getSample().sampleLocation);
    audioState.state = 'play';
    audioState.audio.play();
  } else if (audioState.state === 'play') {
    audioState.state = 'pause';
    audioState.audio.pause();
  } else if (audioState.state === 'pause') {
    audioState.state = 'play';
    audioState.audio.play();
  }
}
