import {addNewPlaylistContainerElement, addToPlaylistToggleElement, 
  newPlaylistToggleElement, addNewPlaylistExitButtonElement,
  addSampleButtonElement, selectedSamplesSection, 
  newListBoxElement, addListBoxElement, 
  createButtonElement, newPlaylistInputElement,
  updateAudioState, createListSectionElement, messageAlertTextElement} from './general.js';

import {currentPlaylistToggle} from '../play-lists.js';

import {createLists} from '../Utils/playlists.js';

import countWords from '../Utils/countWords.js';

function playlistAddNewSummary () {
  addToPlaylistToggleElement.forEach(element => 
    element.addEventListener('click', () => playlistAddNewToggle('add to playlist toggle'))
  )
  newPlaylistToggleElement.forEach(element => 
    element.addEventListener('click', () => playlistAddNewToggle('new playlist toggle'))
  )
  addSampleButtonElement.forEach(element => element.addEventListener('click', () => playlistAddNewToggle('toggle to pick a song')));
  addNewPlaylistExitButtonElement.addEventListener('click', () => playlistAddNewToggle('close'));
  createButtonElement.addEventListener('click', () => playlistAddNewToggle('create playlist'));

}

export default playlistAddNewSummary;

let timerIds = [];
let createListTimerId;
export function playlistAddNewToggle (action) {
  if (action === 'add to playlist toggle') {
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.add('add-clicked');
  }
  
  if (action === 'new playlist toggle') {
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    addNewPlaylistContainerElement.classList.add('new-clicked');
  }

  if (action === 'close') {
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(0.7)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(0.7)';
  }

  if (action === 'open-new') {
    addNewPlaylistContainerElement.classList.add('new-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(1)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(1)';
  }

  if (action === 'open-add') {
    addNewPlaylistContainerElement.classList.add('add-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(1)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(1)';

  }

  if (action === 'toggle to pick a song') {
    timerIds.forEach(timerId => clearTimeout(timerId));
    timerIds = [];
    selectedSamplesSection.forEach(element => element.classList.toggle('clicked'));
    addSampleButtonElement.forEach(element => {
      element.style.setProperty('--set-display', 'none');
      timerIds = [...timerIds, setTimeout(() => 
        element.style.setProperty('--set-display', 'initial')
      , 500)];
    })
  }

  if (action === 'create playlist') {
    const name = newPlaylistInputElement.value
    
    if (name === '') {
      messageAlertTextElement.innerHTML = 
      `<p><span style="color: red">ERROR</span><p>
      <p>
        <span style="color:red">
        *input is 
          <span style="font-weight: 500">empty</span>
        </span>
      </p>
      `
    } else if (name.includes(' ')) {
      messageAlertTextElement.innerHTML = 
      `<p><span style="color: red">ERROR</span><p>
      <p>
        <span style="color:red">
          *no 
          <span style="font-weight: 500;">SPACE</span> 
          is allowed
        </span>
      </p>
      `
    } else if (name.length > 16) {
      messageAlertTextElement.innerHTML = 
      `<p><span style="color: red">ERROR</span><p>
      <p>
        <span style="color:red">
          *more than 
          <span style="font-weight: 500;">16 characters</span>
          is forbidden
        </span>
      </p>
      `
    } else {
      const currentPage = window.location.href;
      updateAudioState('new playlist', createLists(name, 'personal', [1, 4, 5]));
      messageAlertTextElement.innerHTML = `*<span style="font-weight: 500;">${name}</span> Playlist is created`;

      currentPage.includes('play-lists') && currentPlaylistToggle('update playlists HTML');
    }
    
    newPlaylistInputElement.value = '';
    clearTimeout(createListTimerId);
    createListTimerId = setTimeout(() => 
      messageAlertTextElement.textContent = ``
    , 3000);
  }
}