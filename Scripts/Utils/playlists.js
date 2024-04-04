
import samples from '../../Data/Samples.json';

let timerId;

export class Playlist {
  constructor (name, type, list, totalTracks) {
    this.name = name;
    this.type = type;
    this.list = list;
    this.totalTracks = totalTracks;
    this.shuffledList = [];
  }

  shuffleList () {
    let index;
    let shuffledPlaylist = [];

    clearInterval(timerId);

    timerId = setInterval(() => {
      index = Math.round((this.list.length -1) * Math.random());

      shuffledPlaylist.length === 0 && shuffledPlaylist.push(this.list[index]);
      let sameVal;

      shuffledPlaylist.forEach(val => {
        
        if (sameVal === true) {
          return;
        }

        val === this.list[index] ? (sameVal = true) : (sameVal = false);
      });

      if (shuffledPlaylist.length === this.list.length) {
        console.log('finished');
        clearInterval(timerId);
        this.shuffledList = shuffledPlaylist;
        return;
      }
      !sameVal && (shuffledPlaylist = [...shuffledPlaylist, this.list[index]]);
      console.log(shuffledPlaylist);
    }, 1);
  }

  sortList() {
    clearInterval(timerId);

    this.list.sort((a, b) => a - b);
  }

  updatePlaylist (type, other) {
    if (type === 'name') {

    }

    if (type === 'list') {
      let listID = other;
      let matchedID;
      let updatedList = this.list;

      updatedList.forEach( id => {
        if (matchedID) {
          return;
        }

        if (id === listID) {
          matchedID = true;
          return
        }
      });
      
      matchedID ?
      (updatedList = updatedList.filter( id => id !== listID)) :
      (updatedList = [...updatedList, listID]);
      this.list = updatedList;
      
      let totalTracks = 0; 
      updatedList.forEach(() => totalTracks ++);
      this.totalTracks = totalTracks;
    }
  }
}

function createList (type, section) {
  let sampleList;
  if (type === 'system') {
    section === 'playNchill' && (
      sampleList = samples.map(sample => sample.id)
    );

    section === 'favourites' && (
      sampleList = []
    );

    section === 'all-songs' && (
      sampleList = samples.map(sample => sample.id)
    );
  }

  if (type === 'personal') {
    sampleList = section;
  }
  
  return sampleList;
}

export function createLists (name, type, section) {
  const list = [...createList(type, section)];
  let totalTracks = 0; 
  list.forEach(() => totalTracks ++);
  
  return new Playlist(name, type, list, totalTracks); 
}

export const playNchillPlaylist = createLists('Play-N-Chill', 'system', 'playNchill');
export let favouritesPlaylist = createLists('Favourites', 'system', 'favourites');
export let allSongsPlaylist = createLists('All Songs', 'system', 'all-songs');
let albumsPlaylist;
let artistsPlaylist;
