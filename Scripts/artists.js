let toggleButton = true;


const navContainerElement = document.querySelector('.js-nav-container');
const navButtonElements = document.querySelectorAll('.js-nav-button');
const navCoverElement = document.querySelector('.js-album-cover');

const toggleButtonArrowElement = document.querySelector('.js-nav-toggle-arrow');
const toggleButtonElement = document.querySelector('.js-nav-toggle');

function navSummary() {

  navButtonElements.forEach(button => {
    button.addEventListener('click', () => {
      const pageName = button.dataset.pageName;
      pageName === "Home" && (window.location.href = 'home.html');
      pageName === "All Songs" && (window.location.href = 'all-songs.html');
      pageName === "Albums" && (window.location.href = 'albums.html');
      pageName === "Artists" && (window.location.href = 'artists.html');
      pageName === "Favourites" && (window.location.href = 'favourites.html');
      pageName === "Playlists" && (window.location.href = 'play-lists.html');
    });
  });

  toggleButtonElement.addEventListener('mouseenter', () => {
    navContainerElement.classList.add('shift--right');
  });

  toggleButtonElement.addEventListener('mouseleave', () => {
    navContainerElement.classList.remove('shift--right');
  });

  toggleButtonElement.addEventListener('click', toggleButtonUpdate);

}

export default navSummary;

// let toggleButton = true;
function toggleButtonUpdate () {
  toggleButton = !toggleButton;
  navContainerElement.classList.add('animate');
  toggleButtonArrowElement.classList.add('animate');
  // updatePlayerTape('width', toggleButton);

  if (toggleButton) {
    navContainerElement.classList.add('slideInNav');
    navContainerElement.classList.remove('slideOutNav');
    
    toggleButtonArrowElement.classList.add('rotate180deg');
    toggleButtonArrowElement.classList.remove('rotate180degReversed');
    
    toggleButtonElement.classList.add('invert');

    // updatePlayerTapeTotalWidth(true);
  } else {
    navContainerElement.classList.add('slideOutNav');
    navContainerElement.classList.remove('slideInNav');

    toggleButtonArrowElement.classList.add('rotate180degReversed'); 
    toggleButtonArrowElement.classList.remove('rotate180deg');

    toggleButtonElement.classList.remove('invert');

    // updatePlayerTapeTotalWidth(false);
  }

} 

export function pageSelectUpdate () {
  if (toggleButton) {
    navContainerElement.classList.add('slideInNav');
    toggleButtonArrowElement.classList.add('rotate180deg');
    toggleButtonElement.classList.add('invert');

  } else {
    navContainerElement.classList.add('slideInNav');
    toggleButtonArrowElement.classList.add('rotate180deg');

    navContainerElement.classList.add('slideOutNav');
    toggleButtonArrowElement.classList.add('rotate180degReversed'); 

  }
}

navSummary();
pageSelectUpdate();