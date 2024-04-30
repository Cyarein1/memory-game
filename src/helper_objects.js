const messages = {
  congratulations: (flips, time) =>
    `<strong>Congratulations!</strong><br>You completed the game in ${flips} moves and ${time}`,
};

const domSelectors = {
  message: "message",
  shuffleButton: "shuffleButton",
  picture: ".picture",
  image: "img",
  spotsContainer: "pictures-container",
  gridSize: "gridSize",
  timer: "timer",
  flips: "flips",
};

const style = {
  none: "none",
  block: "block",
  matched: "matched",
  inline: "inline",
};

const shuffleButtInnerText = {
  playAgain: "Play Again!",
  restart: "Restart!",
};

const domElements = {
  message: document.getElementById(domSelectors.message),
  shuffleButton: document.getElementById(domSelectors.shuffleButton),
  spotsContainer: document.getElementById(domSelectors.spotsContainer),
  gridSize: document.getElementById(domSelectors.gridSize),
  timer: document.getElementById(domSelectors.timer),
  flips: document.getElementById(domSelectors.flips),
};

const timerObj = { minutes: 0, seconds: 0, timerInterval: null };

const flowControllers = {
  firstClickedImage: null,
  secondClickedImage: null,
  numFlips: 0,
  firstClick: true,
};

module.exports = {
  messages,
  domSelectors,
  style,
  domElements,
  shuffleButtInnerText,
  timerObj,
  flowControllers,
};
