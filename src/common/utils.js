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

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

export { cacheImages, mergeRefs };
