import { loadingScreen } from './selectors';

// Display button for resuming the game
const displayReadyBtn = () => {
  loadingScreen.loader.style.display = 'none';
  loadingScreen.readyBtn.style.display = 'block';
};

// Opens loading screen modal to emulate loading and avoid screen peeking
const renderLoadingScreen = () => {
  loadingScreen.dialog.showModal();

  setTimeout(displayReadyBtn, 1500);
};

// Closes loading screen dialog and resets its values
const hideLoadingScreen = () => {
  loadingScreen.loader.style.display = '';
  loadingScreen.readyBtn.style.display = '';
  loadingScreen.dialog.close();
};

loadingScreen.readyBtn.addEventListener('click', hideLoadingScreen);

export default renderLoadingScreen;
