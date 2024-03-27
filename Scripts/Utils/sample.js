import samples from '../../Data/Samples.json';
import {audioState} from '../Shared/general.js';


export function getSample () {
  let matchedSong;

  samples.forEach(sample => sample.id === audioState.sampleId && (matchedSong = sample));
  return matchedSong;
}

export function getSampleID (type, element) {
  let sampleId;
  const {playList} = audioState;
  const {shuffle} = audioState.playListSettings;
  const list = shuffle ? playList.shuffledList : playList.list;

  if (type === 'element') {
    sampleId = Number(element.dataset.sampleId);
  } 

  type === 'play next' && (
    list.forEach((sampleID, i) => {
      audioState.sampleId === sampleID && (sampleId = list[i+1])
      if (!sampleId) {
        sampleId = list[0];
      }
    })
  );

  type === 'play previous' && (
    list.forEach((sampleID, i) => {
      audioState.sampleId === sampleID && (sampleId = list[i-1])
      if (!sampleId) {
        sampleId = list[0];
      }
    })
  );

  type === 'play from beginning' && (sampleId = list[0]);
  !type && (sampleId = list[0]);

  return sampleId;
}
