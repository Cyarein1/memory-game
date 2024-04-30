function clickAndMatchAllImages(picturePairs) {
  for (const src in picturePairs) {
    const [spot1, spot2] = picturePairs[src];
    const firstClickedSpot = document.getElementById(spot1);
    const secondClickedSpot = document.getElementById(spot2);

    firstClickedSpot.click();
    secondClickedSpot.click();
  }
}

function getTwoMatchingImages(pictureSpots, picturePairs) {
  const pictureSrc = pictureSpots[0].querySelector("img").src;
  const spotsWithMatchingPicture = picturePairs[pictureSrc];
  const [spot1, spot2] = spotsWithMatchingPicture;
  const firstClickedSpot = document.getElementById(spot1);
  const secondClickedSpot = document.getElementById(spot2);
  const picture1 = firstClickedSpot.querySelector("img");
  const picture2 = secondClickedSpot.querySelector("img");

  return [firstClickedSpot, secondClickedSpot, picture1, picture2];
}

function getTwoNotUnMatchingClickedSpots(pictureSpots, picturePairs) {
  const pictureSrc = pictureSpots[0].querySelector("img").src;
  const spotsWithMatchingPicture = picturePairs[pictureSrc];
  let [spot1, spot2] = spotsWithMatchingPicture;
  spot2 = spot2 === "11" ? "10" : (Number(spot2) + 1).toString();

  const firstClickedSpot = document.getElementById(spot1);
  const secondClickedSpot = document.getElementById(spot2);

  return [firstClickedSpot, secondClickedSpot];
}

function getThirdClickedSpot(image1, image2, imagePairs) {
  for (const src of Object.keys(imagePairs)) {
    if (src !== image1.src && src !== image2.src) {
      return document.getElementById(imagePairs[src][0]);
    }
  }
}

module.exports = {
  clickAndMatchAllImages,
  getTwoMatchingImages,
  getTwoNotUnMatchingClickedSpots,
  getThirdClickedSpot,
};
