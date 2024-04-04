
// let array = [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10];


// let index;
// let randomArray = []
// let timerIdA;
// let timerIdB;

// timerIdA = setInterval(() => {
//   index = Math.round((array.length -1) * Math.random());
  
// }, 15);


// let sameVal;
// timerIdB = setInterval(() => {
//   randomArray.length === 0 && randomArray.push(array[index]);
//   sameVal = !sameVal;
//   randomArray.forEach(val => {
//     if (sameVal === true) {
//       return;
//     }
//     if (val === array[index]) {
//       sameVal = true;
//       console.log(`array index: ${array[index]}, val: ${val} sameVal: ${sameVal}`);
//     } else {
//       sameVal = false;
//       console.log(`array index: ${array[index]}, val: ${val} sameVal: ${sameVal}`);
//     }
//   });

//   randomArray.forEach( (val, i) => {

//     if (randomArray.length === array.length) {
//       console.log('finished');
//       clearInterval(timerIdA);
//       clearInterval(timerIdB);
//       return;
//     }
  
//     if (sameVal) {
//       console.log('ok')
//       return;
//     } else if (!sameVal && randomArray.length - 1 === i) {
//       randomArray.push(array[index]);
//     }
    
//     console.log(sameVal);
//   })
//   console.log(randomArray);
// }, 73)


const string = "Name Ahmed";
const names = "Omar Jhon Khalid";
const example = "IntoAlter x Too Martian x Peter Piffe & Othxer Name"

// console.log(example.toLowerCase().split(/\s*[x&]\s*/).map(name => name.trim()));
// console.log(example.toLowerCase().split(/\s*(x|&)\s*/));
// console.log(example.toLowerCase().split(/(\s*(x|&)\s*)/));
// console.log(example.toLowerCase().split(' x '))
// console.log(names.toLowerCase().split(' '));
// console.log(string.toLowerCase().replace(/\s/g, ''));

const string1 = "IntoAlter x Too Martian x Peter Piffen";
const string2 = "Clatx & Shiah Maisel";
const artists = string2.toLowerCase().split(string2.includes('&') ? ' & ' : ' x ').map(string => string.replace(/\s/g, ''));
console.log(artists)
