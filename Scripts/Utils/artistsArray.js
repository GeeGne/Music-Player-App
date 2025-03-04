//  JSON DATA
import samples from '../../Data/Samples.json';

//  ARISTS DATA
import artistsData from '../../Data/Artists.json';

import {Playlist} from './playlists.js';

import strToLowerCaseAndNoSpace from './strToLowerCaseAndNoSpace.js';


class ArtistPlaylist extends Playlist{
  constructor(name, type, list, totalTracks, artistData) {
    super(name, type, list, totalTracks);
    this.artistData = artistData;
  }
}

function artistsArray () {
  let artists = [];

  const artistsNameReference = () => {
    let nameReference = [];
    samples.forEach(samples => {
      let {artistName} = samples;
      const strLowerCase = artistName.toLowerCase();
      const strLowerCaseArray = strLowerCase.split(strLowerCase.includes('&') ? ' & ' : ' x ');
      const strLowerCaseNoSpaceArray = strLowerCaseArray.map(string => string.replace(/\s/g, ''));

      artistName = strLowerCaseNoSpaceArray;
      nameReference = [...nameReference, artistName];
    })

    let repetetiveStrFilter = [];
    nameReference.forEach(array => {
      array.forEach(artist => {
        let matchedItem;
        repetetiveStrFilter.forEach(str => str === artist && (matchedItem = artist))
        matchedItem || (repetetiveStrFilter =[...repetetiveStrFilter, artist])
      });
    });
    
    nameReference = repetetiveStrFilter;
    
    return nameReference
  }

  const artistSongsListAndTotal = () => {
    artistsNameReference().forEach(nameReference => {
      let list = [];
      samples.forEach(sample => {
        let artistName = strToLowerCaseAndNoSpace(sample.artistName);
        
        artistName.includes(nameReference) && ( list = [...list, sample.id]);
      });
      const totalTracks = list.length;
      const type = 'system';
      const playlist = new ArtistPlaylist(nameReference, type, list, totalTracks);
      
      artists = [...artists, playlist];
    });
  }

  const artistNameAndPfp = () => {
    artists.forEach((artist, i) => {
      let matchedItem;
      artistsData.forEach(artistData =>{
        let artistName = strToLowerCaseAndNoSpace(artistData.artistName);
        
        artist.name === artistName && (matchedItem = artistData);
      });

      artists[i].artistData = matchedItem;
    });
  };

  artistSongsListAndTotal();
  artistNameAndPfp();
  return artists
}

export default artistsArray;