const { domElements } = require("./helper_objects");
const { restartGame } = require("./helper_functions");

document.addEventListener("DOMContentLoaded", () => {
  const message = domElements.message;
  const shuffleButton = domElements.shuffleButton;
  const spotsContainer = domElements.spotsContainer;
  const timer = domElements.timer;
  const gridSize = domElements.gridSize;
  const flips = domElements.flips;

  gridSize.addEventListener("change", () => {
    if (spotsContainer.innerHTML != "") {
      restartGame(message, shuffleButton, spotsContainer);
    }
  });

  shuffleButton.addEventListener("click", () => {
    restartGame(message, shuffleButton, spotsContainer);
    
    timer.classList.remove("hidden");
    flips.classList.remove("hidden");
  });
});
