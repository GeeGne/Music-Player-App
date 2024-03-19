import {addNewPlaylistContainerElement, addToPlaylistToggleElement, 
  newPlaylistToggleElement, addNewPlaylistExitButtonElement} from './general.js';

function playlistAddNewSummary () {
  addToPlaylistToggleElement.forEach(element => {
    element.addEventListener('click', () => playlistAddNewToggle('add to playlist'));
  })
  newPlaylistToggleElement.forEach(element => {
    element.addEventListener('click', () => playlistAddNewToggle('new playlist'));
  })
  addNewPlaylistExitButtonElement && addNewPlaylistExitButtonElement.addEventListener('click', () => playlistAddNewToggle('close'));
}

export default playlistAddNewSummary;

export function playlistAddNewToggle (action) {
  if (action === 'add to playlist') {
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.add('add-clicked');
  }
  
  if (action === 'new playlist') {
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    addNewPlaylistContainerElement.classList.add('new-clicked');
  }

  if (action === 'close') {
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.remove('add-clicked');
  }

  if (action === 'open-new') {
    addNewPlaylistContainerElement.classList.add('new-clicked');
  }

  if (action === 'open-add') {
    addNewPlaylistContainerElement.classList.add('add-clicked');
  }
}