import samples from '../../Data/Samples.json'

import {audioState, addNewPlaylistContainerElement, addToPlaylistToggleElement, 
  newPlaylistToggleElement, addNewPlaylistExitButtonElement,
  addSampleButtonElement, selectedSamplesSection, 
  newListBoxElement, addListBoxElement, 
  createButtonElement, newPlaylistInputElement,
  updateAudioState, createListSectionElement, 
  messageAlertTextElement, selectedSamplesContainer, 
addToPlaylistContainerElement} from './general.js';

import {currentPlaylistToggle} from '../play-lists.js';

import {createLists} from '../Utils/playlists.js';

import countWords from '../Utils/countWords.js';
import calAndConvTotalWidthToEM from '../Utils/lenghtCal.js';

let pickSonglistsElement;
let addToPlaylistButtonElement;


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

function updateSelectedSamplesListeners () {
  pickSonglistsElement = document.querySelectorAll('.js-add-selected-samples');
  pickSonglistsElement.forEach(element => {
    element.addEventListener('click', () => playlistAddNewToggle('song clicked', element))
  })
}

function updateChooseAPlaylistListeners () {
  addToPlaylistButtonElement = document.querySelectorAll('.js-add-playlist-button');
  addToPlaylistButtonElement.forEach(element => 
    element.addEventListener('click', () => playlistAddNewToggle('choose a Playlist Add Button clicked', element))
  );
}

let currentIndex = 0;
function slideCalculate (direction, element, i) {  
  
  if (direction === 'next') {
    i === 0 && (currentIndex -= 25.5);

    currentIndex < 
    (-1 * calAndConvTotalWidthToEM(selectedSamplesContainer[0]) + 
    calAndConvTotalWidthToEM(newListBoxElement) + 5) && 
    (currentIndex = -1 * calAndConvTotalWidthToEM(selectedSamplesContainer[0]) + 
    calAndConvTotalWidthToEM(newListBoxElement) + 5);
  } else {
    i === 0 && (currentIndex += 25.5);
    currentIndex > 0 && (currentIndex = 0);
  }

  element.style.setProperty('--set-transform', `translateX(${currentIndex}em) scaleX(1)`);
}

let timerIds = [];
let createListTimerId;
let selectedSamplesId = [];
let addList = [];
export function playlistAddNewToggle (action, element) {
  
  const renderSongsHTML = type => {
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

      addList.length === 0 && (html = emptySamplesHTML(type));
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

      selectedSamplesId.length === 0 && (html = emptySamplesHTML(type));
      selectedSamplesContainer.forEach(element => (element.innerHTML = html));

      selectedSamplesId.length !== 0 && updateSelectedSamplesListeners();
    }
  }

  const renderPlaylistsHTML = () => {
    let html ='';
    let playlists = [];
    const {playLists} = audioState;
    playlists = playLists.filter(list => list.playList.type.includes('personal'));
    playlists.forEach(list => {
      let matchedItem;
      samples.forEach(sample => sample.id === list.playList.list[0] && (matchedItem = sample));

      html +=
      `
        <li>
          <img src="${list.playList.list.length === 0 ? '/Img/Default/playlist-default.jpg' : matchedItem.cover}">
            <h3>${list.playList.name}</h3>
          <button class="js-add-playlist-button" data-playlist-id="${list.id}"></button>
        </li>
      `;
    });

    playlists.length === 0 && (html = 
      `
        <li class ="empty">
          
            <h3>No Playlists are added</h3>
          
        </li>
      `
      ); 

    addToPlaylistContainerElement.innerHTML = html;
    playlists.length !== 0 && updateChooseAPlaylistListeners();
  }

  const songAdded = element => {
    const sampleId = Number(element.dataset.sampleId);
    const song = element;
    let matchedItem;
    selectedSamplesId.forEach(id => id === sampleId && (matchedItem = sampleId));
    matchedItem || (selectedSamplesId = [...selectedSamplesId, sampleId]);

    song.style.opacity = '0';
    element.style.setProperty('--set-transform', `translateX(${currentIndex}em) scaleX(0.1)`);
    setTimeout(() => song.style.display = 'none', 500);

    addList = samples.filter(sample => {
      let matchedItem;
      selectedSamplesId.forEach(id => id === sample.id && (matchedItem = id))
      return sample.id !== matchedItem;
    });

    addList.length === 0 && selectedSamplesContainer.forEach(element => element.innerHTML = emptySamplesHTML('select', true));
  }

  const songRemoved = element => {
    const sampleId = Number(element.dataset.sampleId);
    const song = element
    const newList = selectedSamplesId.filter(id => id !== sampleId)
    selectedSamplesId = newList;

    song.style.opacity = '0';
    element.style.setProperty('--set-transform', `translateX(${currentIndex}em) scaleX(0.1)`);
    setTimeout(() => song.style.display = 'none', 500);
    
    // selectedSamplesId.length === 0 && emptySamplesHTML('selected', true);
    selectedSamplesId.length === 0 && selectedSamplesContainer.forEach(element => element.innerHTML = emptySamplesHTML('select', true));
    console.log(selectedSamplesId);
  }

  const emptySamplesHTML = (type, animate) => {
    if (type === 'select') {
      return (
        `
          <li class="empty ${animate && 'animate popInWFade'}" data-samples-type="add">
            <h3>No Songs available to select</h3>
          </li>
        `
      );
    } else if (type === 'selected') {
      return (
        `
          <li class="empty ${animate && 'animate popInWFade'}" data-samples-type="add">
           <h3>No Songs are selected</h3>
          </li>
        `
      );
    }
  }

  if (action === 'add to playlist toggle') {
    currentIndex = 0;
    selectedSamplesSection.forEach(element => 
      element.classList.contains('clicked') ? 
      renderSongsHTML ('select') : renderSongsHTML ('selected')
    );
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.add('add-clicked');

    renderPlaylistsHTML();
  }
  
  if (action === 'new playlist toggle') {
    currentIndex = 0;
    selectedSamplesSection.forEach(element => 
      element.classList.contains('clicked') ? 
      renderSongsHTML ('select') : renderSongsHTML ('selected')
    );
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    addNewPlaylistContainerElement.classList.add('new-clicked');
  }

  if (action === 'close') {
    currentIndex = 0;
    selectedSamplesSection.forEach(element => element.classList.remove('clicked'));
    addNewPlaylistContainerElement.classList.remove('new-clicked');
    addNewPlaylistContainerElement.classList.remove('add-clicked');
    newListBoxElement.style.transform = 'translateX(-50%) scale(0.7)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(0.7)';
  }

  if (action === 'open-new' || action === 'open-add') {
    currentIndex = 0;
    renderSongsHTML('selected');
    action.includes('new') && addNewPlaylistContainerElement.classList.add('new-clicked')
    action.includes('add') && addNewPlaylistContainerElement.classList.add('add-clicked')
    newListBoxElement.style.transform = 'translateX(-50%) scale(1)';
    addListBoxElement.style.transform = 'translateX(-50%) scale(1)';
  }

  if (action === 'toggle to pick a song') {
    currentIndex = 0;
    timerIds.forEach(timerId => clearTimeout(timerId));
    timerIds = [];
    selectedSamplesSection.forEach(element => element.classList.toggle('clicked'));
    addSampleButtonElement.forEach(element => {
      element.style.setProperty('--set-display', 'none');
      timerIds = [...timerIds, setTimeout(() => 
        element.style.setProperty('--set-display', 'initial')
      , 500)];
    })

    selectedSamplesSection.forEach(element => 
      element.classList.contains('clicked') ? 
      renderSongsHTML ('select') : renderSongsHTML ('selected')  
    );
  }

  if (action === 'create playlist') {
    currentIndex = 0;
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
      selectedSamplesSection.forEach(element => element.classList.remove('clicked'));;
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

  if (action === 'choose a Playlist Add Button clicked') {
    if (element.classList.contains('clicked')) {
      return;
    }

    if (selectedSamplesId.length === 0) {
      return;
    }

    const playlistId = Number(element.dataset.playlistId);
    const {playLists} = audioState;
    const currentPage = window.location.href;

    let matchedList;
    playLists.forEach(list => list.id === playlistId && (matchedList = list.playList.list));
  
    let updatedPlaylist = matchedList;

    selectedSamplesId.forEach(sampleId => {
      let matchedId;
      matchedList.forEach(id => id === sampleId && (matchedId = id));
      matchedId || (updatedPlaylist = [...updatedPlaylist, sampleId]);
    });

    matchedList.length === 0 && (updatedPlaylist = selectedSamplesId);
    
    let newList;
    playLists.forEach(list => list.id === playlistId && (newList = list.playList));
    newList.list = updatedPlaylist;
    newList.totalTracks = updatedPlaylist.length;
    
    audioState.playLists.forEach((list, i) => list.id === playlistId && (list[i] = newList));

    selectedSamplesId = [];
    renderSongsHTML('selected');
    selectedSamplesSection.forEach(element => element.classList.remove('clicked'));;

    element.classList.add('clicked');
    currentPage.includes('play-lists') && currentPlaylistToggle('update playlists HTML');
    currentPage.includes('play-lists') && currentPlaylistToggle('update current playlist HTML');
  }

  if (action === 'next' || action === 'previous') {
    pickSonglistsElement.forEach((element, i) => slideCalculate(action, element, i));
  }
}