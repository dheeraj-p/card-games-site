//Only to be used inside a Component since it coupled to browser
function cacheImages(imageSources, onLoaded, onError) {
  const promises = _.map(imageSources, imageSrc => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = resolve;
      image.onerror = reject;
      window[imageSrc] = image;
    });
  });

  Promise.all(promises).then(onLoaded).catch(onError);
}

export { cacheImages };
