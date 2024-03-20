import {addNewPlaylistContainerElement, addToPlaylistToggleElement, 
  newPlaylistToggleElement, addNewPlaylistExitButtonElement,
  addSampleButtonElement, selectedSamplesSection, 
newListBoxElement, addListBoxElement} from './general.js';

function playlistAddNewSummary () {
  addToPlaylistToggleElement.forEach(element => 
    element.addEventListener('click', () => playlistAddNewToggle('add to playlist'))
  )
  newPlaylistToggleElement.forEach(element => 
    element.addEventListener('click', () => playlistAddNewToggle('new playlist'))
  )
  addNewPlaylistExitButtonElement.addEventListener('click', () => playlistAddNewToggle('close'));
  addSampleButtonElement.forEach(element => element.addEventListener('click', () => playlistAddNewToggle('toggle to pick a song')));
}

export default playlistAddNewSummary;

let timerIds = []
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
      element.style.setProperty('--set-visibility', 'hidden');
      timerIds = [...timerIds, setTimeout(() => 
        element.style.setProperty('--set-visibility', 'visible')
      , 500)];
    })
  }
}