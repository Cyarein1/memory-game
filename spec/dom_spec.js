const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.resolve(__dirname, "..", "index.html"),
  "utf-8"
);
const dom = new JSDOM(html);
const { window } = dom;
global.window = window;
global.document = window.document;
const scriptPath = path.resolve(__dirname, "..", "dist/bundle.js");
require(scriptPath);

const {
  messages,
  domSelectors,
  style,
  domElements,
  shuffleButtInnerText,
} = require("../src/helper_objects");
const { gridSizes } = require("./spec_helper_objects");
const {
  clickAndMatchAllImages,
  getTwoMatchingImages,
  getTwoNotUnMatchingClickedSpots,
  getThirdClickedSpot,
} = require("./spec_helper_functions");

describe("memory game DOM", () => {
  let imageSpots,
    imagePairs,
    shuffleButton,
    message,
    gridSizeInput,
    timer,
    flips;

  beforeEach(() => {
    flips = domElements.flips;
    timer = domElements.timer;
    gridSizeInput = domElements.gridSize;
    gridSizeInput.value = gridSizes[4];
    shuffleButton = domElements.shuffleButton;
    shuffleButton.click();

    imageSpots = document.querySelectorAll(domSelectors.picture);
    imagePairs = {};

    imageSpots.forEach((imageSpot) => {
      const imageSrc = imageSpot.querySelector(domSelectors.image).src;

      if (!imagePairs[imageSrc]) {
        imagePairs[imageSrc] = [imageSpot.id];
      } else {
        imagePairs[imageSrc].push(imageSpot.id);
      }
    });

    message = domElements.message;
  });

  it("should keep the two clicked images displayed if they are matching.", () => {
    const [firstClickedSpot, secondClickedSpot, image1, image2] =
      getTwoMatchingImages(imageSpots, imagePairs);
    expect(image1.style.display && image2.style.display).toBe("");

    firstClickedSpot.click();
    secondClickedSpot.click();
    expect(image1.style.display && image2.style.display).toBe(style.block);
  });

  it("should hide the two clicked images after 1000 milliseconds if they do not match.", (done) => {
    const [firstClickedSpot, secondClickedSpot] =
      getTwoNotUnMatchingClickedSpots(imageSpots, imagePairs);

    firstClickedSpot.click();
    secondClickedSpot.click();


    const image1 = firstClickedSpot.querySelector(domSelectors.image);
    const image2 = secondClickedSpot.querySelector(domSelectors.image);

    expect(image1.style.display && image2.style.display).toBe(style.block);

    setTimeout(() => {
      expect(image1.style.display && image2.style.display).toBe(style.none);
      done();
    }, 1000);
  });

  it("should add class 'matched' to the two clicked matching images to show that they are no longer clickable.", () => {
    const [firstClickedSpot, secondClickedSpot, image1, image2] =
      getTwoMatchingImages(imageSpots, imagePairs);

    expect(image1.classList.contains(style.matched)).toBe(false);
    expect(image2.classList.contains(style.matched)).toBe(false);

    firstClickedSpot.click();
    secondClickedSpot.click();

    expect(image1.classList.contains(style.matched)).toBe(true);
    expect(image2.classList.contains(style.matched)).toBe(true);
  });

  it("should congratulations message to element with id 'message' when all images have been successfully matched.", () => {
    expect(message.innerHTML).toBe("");

    clickAndMatchAllImages(imagePairs);

    expect(message.innerHTML).toContain(
      messages.congratulations(12, "0 seconds")
    );
  });

  it("should display the shuffle button when all the images have been successfully matched.", () => {
    shuffleButton.style.display = style.none;
    expect(shuffleButton.style.display).toBe(style.none);

    clickAndMatchAllImages(imagePairs);

    expect(shuffleButton.style.display).toBe(style.inline);
  });

  it("should not allow flipping more than 2 images at a time.", (done) => {
    const [firstClickedSpot, secondClickedSpot] =
      getTwoNotUnMatchingClickedSpots(imageSpots, imagePairs);
    const image1 = firstClickedSpot.querySelector(domSelectors.image);
    const image2 = secondClickedSpot.querySelector(domSelectors.image);
    const thirdClickedSpot = getThirdClickedSpot(image1, image2, imagePairs);
    const image3 = thirdClickedSpot.querySelector("img");

    expect(
      image1.style.display && image2.style.display && image3.style.display
    ).toBe("");

    firstClickedSpot.click();
    secondClickedSpot.click();
    thirdClickedSpot.click();

    expect(image1.style.display && image2.style.display).toBe(style.block);
    expect(image3.style.display).toBe("");

    setTimeout(() => {
      done();
    }, 1000);
  });

  describe("configurable grid size", () => {
    it("should display set the game to any selected available grid size.", () => {
      gridSizes.forEach((gridSize) => {
        gridSizeInput.value = gridSize;
        shuffleButton.click();

        const cardsContainer = domElements.spotsContainer;
        const numCards = cardsContainer.querySelectorAll("div").length;
        const [rows, columns] = gridSize.split("x").map(Number);

        expect(numCards).toBe(rows * columns);
      });
    });

    it("should display the shuffle button after one image has been clicked.", () => {
      expect(shuffleButton.style.display).toBe(style.none);

      const imageSpot = imageSpots[0];
      imageSpot.click();

      expect(shuffleButton.style.display).toBe(style.inline);
    });

    it("should set the innerText of the shuffle button to 'Play Again!' when all the images have been matched.", () => {
      expect(shuffleButton.innerText).not.toBe(shuffleButtInnerText.playAgain);

      clickAndMatchAllImages(imagePairs);

      expect(shuffleButton.innerText).toBe(shuffleButtInnerText.playAgain);
    });
  });

  describe("timer", () => {
    it("should add time taken to complete game to element with id 'message' when all images have been successfully matched.", () => {
      expect(message.innerHTML).toBe("");

      clickAndMatchAllImages(imagePairs);
      expect(message.innerHTML).toMatch(/\d+ second(s)?\./);
    });

    it("should increment time as the user plays the game", (done) => {
      expect(timer.textContent).toBe("00:00");
      imageSpots[0].click();

      setTimeout(() => {
        expect(timer.textContent).not.toBe("00:00");
        done();
      }, 2000);
    });

    it("should reset timer when the shuffleButton game button is clicked.", () => {
      timer.textContent = "00:02";

      shuffleButton.click();
      expect(timer.textContent).toBe("00:00");
    });
  });

  describe("flips", () => {
    it("should increment the number of flips every time a card is flipped.", () => {
      expect(flips.textContent).toBe("Flips: 0");

      imageSpots[0].click();
      expect(flips.textContent).toBe("Flips: 1");
    });

    it("should not increment the number of flips when the card clicked is already flipped.", () => {
      imageSpots[0].click();
      expect(flips.textContent).toBe("Flips: 1");

      imageSpots[0].click();
      expect(flips.textContent).toBe("Flips: 1");
    });

    it("should reset the number of flips when the shuffleButton is clicked", () => {
      flips.textContent = "Flips: 10";

      shuffleButton.click();
      expect(flips.textContent).toBe("Flips: 0");
    });
  });
});
