const {
  messages,
  domSelectors,
  style,
  domElements,
  shuffleButtInnerText,
  timerObj,
  flowControllers,
} = require("./helper_objects");
const allImages = require("./images.json");

function restartGame(message, shuffleButton, spotsContainer) {
  message.classList.add("hidden");
  spotsContainer.innerHTML = "";
  const numOfSpots = getNumOfSpots();
  if (timerObj.timerInterval) stopTimer();
  flowControllers.firstClick = true;

  message.textContent = "";
  shuffleButton.innerText = shuffleButtInnerText.restart;
  shuffleButton.style.display = style.none;

  domElements.timer.textContent = "00:00";
  domElements.flips.textContent = "Flips: 0";

  flowControllers.firstClickedImage = null;
  flowControllers.secondClickedImage = null;

  shuffle(numOfSpots, spotsContainer, message);
}

function getNumOfSpots() {
  const gridSize = domElements.gridSize.value;
  const [rows, columns] = gridSize.split("x").map(Number);

  const numOfSpots = rows * columns;

  return numOfSpots;
}

function createImageSpots(numOfSpots, spotsContainer) {
  let numCols;
  numOfSpots === 4
    ? (numCols = 2)
    : numOfSpots === 6
    ? (numCols = 3)
    : numOfSpots === 8
    ? (numCols = 4)
    : numOfSpots === 10
    ? (numCols = 5)
    : numOfSpots === 12
    ? (numCols = 4)
    : numOfSpots === 14
    ? (numCols = 7)
    : (numCols = 4);

  for (let i = 0; i < numOfSpots; i++) {
    const spot = document.createElement("div");
    spot.className = "picture";
    const spotId = i.toString();
    spot.id = spotId;

    spotsContainer.appendChild(spot);
  }

  spotsContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
}

function shuffle(numOfSpots, spotsContainer, message) {
  spotsContainer.innerHTML = "";
  createImageSpots(numOfSpots, spotsContainer);
  const selectedPictures = getRandomImages(numOfSpots / 2);
  const imageSpots = document.querySelectorAll(domSelectors.picture);
  const selectedSpots = [];
  const imagesPairSpots = [];

  imageSpots.forEach((spot) => {
    spot.innerHTML = "";
  });

  const randomValue = () => Math.floor(Math.random() * numOfSpots);
  for (let i = 0; i < selectedPictures.length; i++) {
    let spot1 = randomValue();
    let spot2 = randomValue();

    while (
      spot2 === spot1 ||
      selectedSpots.includes(spot1) ||
      selectedSpots.includes(spot2)
    ) {
      spot1 = randomValue();
      spot2 = randomValue();
    }
    selectedSpots.push(spot1);
    selectedSpots.push(spot2);

    const pictureSpot1 = document.getElementById(spot1.toString());
    const pictureSpot2 = document.getElementById(spot2.toString());

    const picture1Element = document.createElement(domSelectors.image);
    const picture2Element = document.createElement(domSelectors.image);

    picture1Element.src = selectedPictures[i];
    picture2Element.src = selectedPictures[i];

    pictureSpot1.appendChild(picture1Element);
    pictureSpot2.appendChild(picture2Element);

    imagesPairSpots.push([spot1, spot2]);
  }

  addClickEventListeners(message);
}

function getRandomImages(numOfImages) {
  const selectedPictures = [];

  for (let i = 0; i < numOfImages; i++) {
    let selectedPicture =
      allImages[Math.floor(Math.random() * allImages.length)];

    while (selectedPictures.includes(selectedPicture)) {
      selectedPicture = allImages[Math.floor(Math.random() * allImages.length)];
    }

    selectedPictures.push(selectedPicture);
  }

  return selectedPictures;
}

function handleImageClick(event) {
  flowControllers.numFlips++;
  domElements.shuffleButton.style.display = style.inline;
  const clickedImage = event.currentTarget.querySelector(domSelectors.image);

  if (
    clickedImage &&
    clickedImage !== flowControllers.firstClickedImage &&
    (flowControllers.firstClickedImage === null ||
      flowControllers.secondClickedImage === null) &&
    clickedImage.style.display !== style.block
  ) {
    updateNumFlips();
    clickedImage.style.display = style.block;
    if (
      flowControllers.firstClickedImage &&
      !flowControllers.secondClickedImage
    ) {
      flowControllers.secondClickedImage = clickedImage;
      if (
        !checkIfCorrect(
          flowControllers.firstClickedImage,
          flowControllers.secondClickedImage
        )
      ) {
        setTimeout(() => {
          flowControllers.firstClickedImage.style.display = style.none;
          flowControllers.secondClickedImage.style.display = style.none;
          flowControllers.firstClickedImage = null;
          flowControllers.secondClickedImage = null;
        }, 1000);
      } else {
        [
          flowControllers.firstClickedImage,
          flowControllers.secondClickedImage,
        ] = handleMatchedImages(
          flowControllers.firstClickedImage,
          flowControllers.secondClickedImage
        );
      }
    } else {
      flowControllers.firstClickedImage = clickedImage;
    }
  }
  if (flowControllers.firstClick) {
    startTimer();
    flowControllers.firstClick = false;
  }
}

function addClickEventListeners(message) {
  const imageSpots = document.querySelectorAll(domSelectors.picture);

  imageSpots.forEach((spot) => {
    spot.addEventListener("click", (event) => {
      handleImageClick(event);
      updateResultMessage(message, domElements.shuffleButton);
    });
  });
}

function handleMatchedImages(firstClickedImage, secondClickedImage) {
  firstClickedImage.classList.add(style.matched);
  secondClickedImage.classList.add(style.matched);

  return [null, null];
}

function checkIfCorrect(firstClickedImage, secondClickedImage) {
  return (
    firstClickedImage &&
    secondClickedImage &&
    firstClickedImage.src === secondClickedImage.src
  );
}

function checkIfAllImagesDisplayed() {
  const imageSpots = document.querySelectorAll(domSelectors.picture);
  for (const spot of imageSpots) {
    const image = spot.querySelector(domSelectors.image);
    if (!image || image.style.display !== style.block) {
      return false;
    }
  }
  return true;
}

function updateResultMessage(message, shuffleButton) {
  if (checkIfAllImagesDisplayed()) {
    shuffleButton.innerText = shuffleButtInnerText.playAgain;
    stopTimer();
    const timeMessage = structureTimeMessage(timerObj);
    const flips = domElements.flips.textContent.split(" ")[1];
    message.innerHTML = messages.congratulations(flips, timeMessage);
    message.classList.remove("hidden");
  }
}

function structureTimeMessage(timerObj) {
  const minutesText = timerObj.minutes === 1 ? "minute" : "minutes";
  const secondsText = timerObj.seconds === 1 ? "second" : "seconds";

  if (timerObj.minutes === 0) {
    return `${timerObj.seconds} ${secondsText}.`;
  } else if (timerObj.seconds === 0) {
    return `${timerObj.minutes} ${minutesText}.`;
  } else {
    return `${timerObj.minutes} ${minutesText} ${timerObj.seconds} ${secondsText}.`;
  }
}

function startTimer() {
  timerObj.minutes = 0;
  timerObj.seconds = 0;
  timerObj.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerObj.timerInterval);
}

function updateTimer() {
  timerObj.seconds++;
  if (timerObj.seconds === 60) {
    timerObj.minutes++;
    timerObj.seconds = 0;
  }

  const formattedMinutes = padZero(timerObj.minutes);
  const formattedSeconds = padZero(timerObj.seconds);
  const timerDisplay = domElements.timer;
  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function padZero(value) {
  return value < 10 ? "0" + value : value;
}

function updateNumFlips() {
  const flips = document.getElementById("flips");
  const flipCount = parseInt(flips.textContent.split(" ")[1]) + 1;
  flips.textContent = `Flips: ${flipCount}`;
}

module.exports = {
  shuffle,
  getNumOfSpots,
  restartGame,
};
