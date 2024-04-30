/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { domElements } = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\nconst { restartGame } = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.js\");\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n  const message = domElements.message;\n  const shuffleButton = domElements.shuffleButton;\n  const spotsContainer = domElements.spotsContainer;\n  const timer = domElements.timer;\n  const gridSize = domElements.gridSize;\n  const flips = domElements.flips;\n\n  gridSize.addEventListener(\"change\", () => {\n    if (spotsContainer.innerHTML != \"\") {\n      restartGame(message, shuffleButton, spotsContainer);\n    }\n  });\n\n  shuffleButton.addEventListener(\"click\", () => {\n    restartGame(message, shuffleButton, spotsContainer);\n    \n    timer.classList.remove(\"hidden\");\n    flips.classList.remove(\"hidden\");\n  });\n});\n\n\n//# sourceURL=webpack://siyabonga-mthethwa-222-memory-game-in-vanilla-js-javascript/./src/dom.js?");

/***/ }),

/***/ "./src/helper_functions.js":
/*!*********************************!*\
  !*** ./src/helper_functions.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  messages,\n  domSelectors,\n  style,\n  domElements,\n  shuffleButtInnerText,\n  timerObj,\n  flowControllers,\n} = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\nconst allImages = __webpack_require__(/*! ./images.json */ \"./src/images.json\");\n\nfunction restartGame(message, shuffleButton, spotsContainer) {\n  message.classList.add(\"hidden\");\n  spotsContainer.innerHTML = \"\";\n  const numOfSpots = getNumOfSpots();\n  if (timerObj.timerInterval) stopTimer();\n  flowControllers.firstClick = true;\n\n  message.textContent = \"\";\n  shuffleButton.innerText = shuffleButtInnerText.restart;\n  shuffleButton.style.display = style.none;\n\n  domElements.timer.textContent = \"00:00\";\n  domElements.flips.textContent = \"Flips: 0\";\n\n  flowControllers.firstClickedImage = null;\n  flowControllers.secondClickedImage = null;\n\n  shuffle(numOfSpots, spotsContainer, message);\n}\n\nfunction getNumOfSpots() {\n  const gridSize = domElements.gridSize.value;\n  const [rows, columns] = gridSize.split(\"x\").map(Number);\n\n  const numOfSpots = rows * columns;\n\n  return numOfSpots;\n}\n\nfunction createImageSpots(numOfSpots, spotsContainer) {\n  let numCols;\n  numOfSpots === 4\n    ? (numCols = 2)\n    : numOfSpots === 6\n    ? (numCols = 3)\n    : numOfSpots === 8\n    ? (numCols = 4)\n    : numOfSpots === 10\n    ? (numCols = 5)\n    : numOfSpots === 12\n    ? (numCols = 4)\n    : numOfSpots === 14\n    ? (numCols = 7)\n    : (numCols = 4);\n\n  for (let i = 0; i < numOfSpots; i++) {\n    const spot = document.createElement(\"div\");\n    spot.className = \"picture\";\n    const spotId = i.toString();\n    spot.id = spotId;\n\n    spotsContainer.appendChild(spot);\n  }\n\n  spotsContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;\n}\n\nfunction shuffle(numOfSpots, spotsContainer, message) {\n  spotsContainer.innerHTML = \"\";\n  createImageSpots(numOfSpots, spotsContainer);\n  const selectedPictures = getRandomImages(numOfSpots / 2);\n  const imageSpots = document.querySelectorAll(domSelectors.picture);\n  const selectedSpots = [];\n  const imagesPairSpots = [];\n\n  imageSpots.forEach((spot) => {\n    spot.innerHTML = \"\";\n  });\n\n  const randomValue = () => Math.floor(Math.random() * numOfSpots);\n  for (let i = 0; i < selectedPictures.length; i++) {\n    let spot1 = randomValue();\n    let spot2 = randomValue();\n\n    while (\n      spot2 === spot1 ||\n      selectedSpots.includes(spot1) ||\n      selectedSpots.includes(spot2)\n    ) {\n      spot1 = randomValue();\n      spot2 = randomValue();\n    }\n    selectedSpots.push(spot1);\n    selectedSpots.push(spot2);\n\n    const pictureSpot1 = document.getElementById(spot1.toString());\n    const pictureSpot2 = document.getElementById(spot2.toString());\n\n    const picture1Element = document.createElement(domSelectors.image);\n    const picture2Element = document.createElement(domSelectors.image);\n\n    picture1Element.src = selectedPictures[i];\n    picture2Element.src = selectedPictures[i];\n\n    pictureSpot1.appendChild(picture1Element);\n    pictureSpot2.appendChild(picture2Element);\n\n    imagesPairSpots.push([spot1, spot2]);\n  }\n\n  addClickEventListeners(message);\n}\n\nfunction getRandomImages(numOfImages) {\n  const selectedPictures = [];\n\n  for (let i = 0; i < numOfImages; i++) {\n    let selectedPicture =\n      allImages[Math.floor(Math.random() * allImages.length)];\n\n    while (selectedPictures.includes(selectedPicture)) {\n      selectedPicture = allImages[Math.floor(Math.random() * allImages.length)];\n    }\n\n    selectedPictures.push(selectedPicture);\n  }\n\n  return selectedPictures;\n}\n\nfunction handleImageClick(event) {\n  flowControllers.numFlips++;\n  domElements.shuffleButton.style.display = style.inline;\n  const clickedImage = event.currentTarget.querySelector(domSelectors.image);\n\n  if (\n    clickedImage &&\n    clickedImage !== flowControllers.firstClickedImage &&\n    (flowControllers.firstClickedImage === null ||\n      flowControllers.secondClickedImage === null) &&\n    clickedImage.style.display !== style.block\n  ) {\n    updateNumFlips();\n    clickedImage.style.display = style.block;\n    if (\n      flowControllers.firstClickedImage &&\n      !flowControllers.secondClickedImage\n    ) {\n      flowControllers.secondClickedImage = clickedImage;\n      if (\n        !checkIfCorrect(\n          flowControllers.firstClickedImage,\n          flowControllers.secondClickedImage\n        )\n      ) {\n        setTimeout(() => {\n          flowControllers.firstClickedImage.style.display = style.none;\n          flowControllers.secondClickedImage.style.display = style.none;\n          flowControllers.firstClickedImage = null;\n          flowControllers.secondClickedImage = null;\n        }, 1000);\n      } else {\n        [\n          flowControllers.firstClickedImage,\n          flowControllers.secondClickedImage,\n        ] = handleMatchedImages(\n          flowControllers.firstClickedImage,\n          flowControllers.secondClickedImage\n        );\n      }\n    } else {\n      flowControllers.firstClickedImage = clickedImage;\n    }\n  }\n  if (flowControllers.firstClick) {\n    startTimer();\n    flowControllers.firstClick = false;\n  }\n}\n\nfunction addClickEventListeners(message) {\n  const imageSpots = document.querySelectorAll(domSelectors.picture);\n\n  imageSpots.forEach((spot) => {\n    spot.addEventListener(\"click\", (event) => {\n      handleImageClick(event);\n      updateResultMessage(message, domElements.shuffleButton);\n    });\n  });\n}\n\nfunction handleMatchedImages(firstClickedImage, secondClickedImage) {\n  firstClickedImage.classList.add(style.matched);\n  secondClickedImage.classList.add(style.matched);\n\n  return [null, null];\n}\n\nfunction checkIfCorrect(firstClickedImage, secondClickedImage) {\n  return (\n    firstClickedImage &&\n    secondClickedImage &&\n    firstClickedImage.src === secondClickedImage.src\n  );\n}\n\nfunction checkIfAllImagesDisplayed() {\n  const imageSpots = document.querySelectorAll(domSelectors.picture);\n  for (const spot of imageSpots) {\n    const image = spot.querySelector(domSelectors.image);\n    if (!image || image.style.display !== style.block) {\n      return false;\n    }\n  }\n  return true;\n}\n\nfunction updateResultMessage(message, shuffleButton) {\n  if (checkIfAllImagesDisplayed()) {\n    shuffleButton.innerText = shuffleButtInnerText.playAgain;\n    stopTimer();\n    const timeMessage = structureTimeMessage(timerObj);\n    const flips = domElements.flips.textContent.split(\" \")[1];\n    message.innerHTML = messages.congratulations(flips, timeMessage);\n    message.classList.remove(\"hidden\");\n  }\n}\n\nfunction structureTimeMessage(timerObj) {\n  const minutesText = timerObj.minutes === 1 ? \"minute\" : \"minutes\";\n  const secondsText = timerObj.seconds === 1 ? \"second\" : \"seconds\";\n\n  if (timerObj.minutes === 0) {\n    return `${timerObj.seconds} ${secondsText}.`;\n  } else if (timerObj.seconds === 0) {\n    return `${timerObj.minutes} ${minutesText}.`;\n  } else {\n    return `${timerObj.minutes} ${minutesText} ${timerObj.seconds} ${secondsText}.`;\n  }\n}\n\nfunction startTimer() {\n  timerObj.minutes = 0;\n  timerObj.seconds = 0;\n  timerObj.timerInterval = setInterval(updateTimer, 1000);\n}\n\nfunction stopTimer() {\n  clearInterval(timerObj.timerInterval);\n}\n\nfunction updateTimer() {\n  timerObj.seconds++;\n  if (timerObj.seconds === 60) {\n    timerObj.minutes++;\n    timerObj.seconds = 0;\n  }\n\n  const formattedMinutes = padZero(timerObj.minutes);\n  const formattedSeconds = padZero(timerObj.seconds);\n  const timerDisplay = domElements.timer;\n  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;\n}\n\nfunction padZero(value) {\n  return value < 10 ? \"0\" + value : value;\n}\n\nfunction updateNumFlips() {\n  const flips = document.getElementById(\"flips\");\n  const flipCount = parseInt(flips.textContent.split(\" \")[1]) + 1;\n  flips.textContent = `Flips: ${flipCount}`;\n}\n\nmodule.exports = {\n  shuffle,\n  getNumOfSpots,\n  restartGame,\n};\n\n\n//# sourceURL=webpack://siyabonga-mthethwa-222-memory-game-in-vanilla-js-javascript/./src/helper_functions.js?");

/***/ }),

/***/ "./src/helper_objects.js":
/*!*******************************!*\
  !*** ./src/helper_objects.js ***!
  \*******************************/
/***/ ((module) => {

eval("const messages = {\n  congratulations: (flips, time) =>\n    `<strong>Congratulations!</strong><br>You completed the game in ${flips} moves and ${time}`,\n};\n\nconst domSelectors = {\n  message: \"message\",\n  shuffleButton: \"shuffleButton\",\n  picture: \".picture\",\n  image: \"img\",\n  spotsContainer: \"pictures-container\",\n  gridSize: \"gridSize\",\n  timer: \"timer\",\n  flips: \"flips\",\n};\n\nconst style = {\n  none: \"none\",\n  block: \"block\",\n  matched: \"matched\",\n  inline: \"inline\",\n};\n\nconst shuffleButtInnerText = {\n  playAgain: \"Play Again!\",\n  restart: \"Restart!\",\n};\n\nconst domElements = {\n  message: document.getElementById(domSelectors.message),\n  shuffleButton: document.getElementById(domSelectors.shuffleButton),\n  spotsContainer: document.getElementById(domSelectors.spotsContainer),\n  gridSize: document.getElementById(domSelectors.gridSize),\n  timer: document.getElementById(domSelectors.timer),\n  flips: document.getElementById(domSelectors.flips),\n};\n\nconst timerObj = { minutes: 0, seconds: 0, timerInterval: null };\n\nconst flowControllers = {\n  firstClickedImage: null,\n  secondClickedImage: null,\n  numFlips: 0,\n  firstClick: true,\n};\n\nmodule.exports = {\n  messages,\n  domSelectors,\n  style,\n  domElements,\n  shuffleButtInnerText,\n  timerObj,\n  flowControllers,\n};\n\n\n//# sourceURL=webpack://siyabonga-mthethwa-222-memory-game-in-vanilla-js-javascript/./src/helper_objects.js?");

/***/ }),

/***/ "./src/images.json":
/*!*************************!*\
  !*** ./src/images.json ***!
  \*************************/
/***/ ((module) => {

"use strict";
eval("module.exports = /*#__PURE__*/JSON.parse('[\"./src/assets/1.jpg\",\"./src/assets/2.jpg\",\"./src/assets/3.jpg\",\"./src/assets/4.jpg\",\"./src/assets/5.jpg\",\"./src/assets/6.jpg\",\"./src/assets/7.jpg\",\"./src/assets/8.jpg\",\"./src/assets/9.jpg\",\"./src/assets/10.jpg\",\"./src/assets/11.jpg\",\"./src/assets/12.jpg\"]');\n\n//# sourceURL=webpack://siyabonga-mthethwa-222-memory-game-in-vanilla-js-javascript/./src/images.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/dom.js");
/******/ 	
/******/ })()
;