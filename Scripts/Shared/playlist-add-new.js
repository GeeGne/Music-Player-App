import samples from '../../Data/Samples.json'

import {addNewPlaylistContainerElement, addToPlaylistToggleElement, 
  newPlaylistToggleElement, addNewPlaylistExitButtonElement,
  addSampleButtonElement, selectedSamplesSection, 
  newListBoxElement, addListBoxElement, 
  createButtonElement, newPlaylistInputElement,
updateAudioState, createListSectionElement, messageAlertTextElement, selectedSamplesContainer} from './general.js';

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
  addSampleButtonElement.forEach(element => {
    element.addEventListener('click', () => playlistAddNewToggle('toggle to pick a song', element))
  });
  addNewPlaylistExitButtonElement.addEventListener('click', () => playlistAddNewToggle('close'));
  createButtonElement.addEventListener('click', () => playlistAddNewToggle('create playlist'));
}

export default playlistAddNewSummary;

function updateSelectedSamplesListeners() {
  const pickSonglistsElement = document.querySelectorAll('.js-add-selected-samples');
  pickSonglistsElement.forEach(element => {
    element.addEventListener('click', () => playlistAddNewToggle('song clicked', element))
  })
  
}

let timerIds = [];
let createListTimerId;
let selectedSamplesId = [];
let addList = [];
export function playlistAddNewToggle (action, element) {
  
  const renderSongsHTML = (type, listName) => {
    let html = '';
    
    if (type === 'select') {
      addList = samples.filter(sample => {
        let matchedItem;
        selectedSamplesId.forEach(id => id === sample.id && (matchedItem = id))
        return sample.id !== matchedItem;
      })
      // const addList = [];
      addList.forEach(list => {
          html += 
          `
            <li class="js-add-selected-samples" data-samples-type="select" data-sample-id="${list.id}">
              <img src="${list.cover}">
              <h3>${list.album}</h3>
              <h3>${list.artistName}</h3>
            </li>
          `
      })

      if (addList.length === 0) {
        emptySamplesHTML(type);
        return;
      }

      // selectedSamplesContainer.forEach(element => {
      //   const matchedName = element.dataset.listName;
      //   listName === matchedName && (element.innerHTML = html);
      // })
      selectedSamplesContainer.forEach(element => (element.innerHTML = html));

      addList.length !== 0 && updateSelectedSamplesListeners();
    }

    if (type === 'selected') {
      let html = ''; 
      selectedSamplesId.forEach(id => {
        let matchedItem;
        samples.forEach(sample => sample.id === id && (matchedItem = sample));

        matchedItem && (
          html +=
          `
            <li class="js-add-selected-samples" data-samples-type="selected" 
              data-sample-id="${matchedItem.id}">
              <img src="${matchedItem.cover}">
              <h3>${matchedItem.album}</h3>
              <h3>${matchedItem.artistName}</h3>
            </li>
          `
        )
      })
      
      if (selectedSamplesId.length === 0) {
        emptySamplesHTML(type);
        return;
      }
      
      // selectedSamplesContainer.forEach(element => {
      //   const matchedName = element.dataset.listname;
      //   listName === matchedName && (element.innerHTML = html);
      // });
      selectedSamplesContainer.forEach(element => (element.innerHTML = html));

      selectedSamplesId.length !== 0 && updateSelectedSamplesListeners();
    }
  }

  const songAdded = element => {
    const sampleId = Number(element.dataset.sampleId);
    const song = element;
    let matchedItem;
    selectedSamplesId.forEach(id => id === sampleId && (matchedItem = sampleId));
    matchedItem || (selectedSamplesId = [...selectedSamplesId, sampleId]);

    song.style.opacity = '0';
    song.style.transform = 'scaleX(0.1)';
    setTimeout(() => song.style.display = 'none', 500);

    addList = samples.filter(sample => {
      let matchedItem;
      selectedSamplesId.forEach(id => id === sample.id && (matchedItem = id))
      return sample.id !== matchedItem;
    });

    addList.length === 0 && emptySamplesHTML('select');
    console.log({addList});
  }

  const songRemoved = element => {
    const sampleId = Number(element.dataset.sampleId);
    const song = element
    const newList = selectedSamplesId.filter(id => id !== sampleId)
    selectedSamplesId = newList;

    song.style.opacity = '0';
    song.style.transform = 'scaleX(0.1)';
    setTimeout(() => song.style.display = 'none', 500);
    
    selectedSamplesId.length === 0 && emptySamplesHTML('selected');
    console.log(selectedSamplesId);
  }

  const emptySamplesHTML = type => {
    // const {listName} = element.dataset;
    selectedSamplesContainer.forEach(element => {
      // const {matchedName} = element.dataset;
      // listName === matchedName && (
      //   element.innerHTML = 
      //   `
      //     <li class="empty" data-samples-type="add">
            
      //       <h3>No Songs available to select</h3>
            
      //     </li>
      //   `);

      console.log(type);
      type === 'select' && (element.innerHTML = 
        `
          <li class="empty" data-samples-type="add">
            <h3>No Songs available to select</h3>
          </li>
        `
      );

      type === 'selected' && (element.innerHTML = 
        `
          <li class="empty" data-samples-type="add">
            <h3>No Songs are selected</h3>
          </li>
        `
      );
    });
  }

  if (action === 'add to playlist toggle') {
    selectedSamplesSection.forEach(element => 
        element.classList.contains('clicked') ? 
        renderSongsHTML ('select') : renderSongsHTML ('selected')
    );
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.add('add-clicked');
  }
  
  if (action === 'new playlist toggle') {
    selectedSamplesSection.forEach(element => 
      element.classList.contains('clicked') ? 
      renderSongsHTML ('select') : renderSongsHTML ('selected')
    );
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    addNewPlaylistContainerElement.classList.add('new-clicked');
  }

  if (action === 'close') {
    // selectedSamplesId = [];
    selectedSamplesSection.forEach(element => element.classList.remove('clicked'));
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(0.7)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(0.7)';
  }

  if (action === 'open-new') {
    renderSongsHTML('selected');
    addNewPlaylistContainerElement.classList.add('new-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(1)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(1)';
  }

  if (action === 'open-add') {
    renderSongsHTML('selected');
    addNewPlaylistContainerElement.classList.add('add-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(1)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(1)';

  }

  if (action === 'toggle to pick a song') {
    const {listName} = element.dataset;

    timerIds.forEach(timerId => clearTimeout(timerId));
    timerIds = [];
    selectedSamplesSection.forEach(element => element.classList.toggle('clicked'));
    addSampleButtonElement.forEach(element => {
      element.style.setProperty('--set-display', 'none');
      timerIds = [...timerIds, setTimeout(() => 
        element.style.setProperty('--set-display', 'initial')
      , 500)];
    })

    selectedSamplesSection.forEach(element => {
      const matchedName = element.dataset.listName;
      if (listName === matchedName) {
        element.classList.contains('clicked') ? renderSongsHTML ('select', listName) : renderSongsHTML ('selected', listName)
      }
    });
  }

  if (action === 'create playlist') {
    const name = newPlaylistInputElement.value
    
    if (name === '') {
      messageAlertTextElement.innerHTML = 
      `
        <p><span style="color: red">ERROR</span><p>
        <p>
          <span style="color:red">
          *input is 
            <span style="font-weight: 500">empty</span>
          </span>
        </p>
      `
    } else if (name.includes(' ')) {
      messageAlertTextElement.innerHTML = 
      `
        <p><span style="color: red">ERROR</span><p>
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
      `
        <p><span style="color: red">ERROR</span><p>
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
      updateAudioState('new playlist', createLists(name, 'personal', selectedSamplesId));
      messageAlertTextElement.innerHTML = `*<span style="font-weight: 500;">${name}</span> Playlist is created`;

      currentPage.includes('play-lists') && currentPlaylistToggle('update playlists HTML');

      selectedSamplesId = [];
      renderSongsHTML('selected');
      selectedSamplesSection.forEach(element => element.classList.remove('clicked'));
    }
    
    newPlaylistInputElement.value = '';
    clearTimeout(createListTimerId);
    createListTimerId = setTimeout(() => 
      messageAlertTextElement.textContent = ``
    , 3000);
  }

  if (action === 'song clicked') {
    const {samplesType} = element.dataset;
    samplesType === "select" ? songAdded(element) : songRemoved(element);
  }
}