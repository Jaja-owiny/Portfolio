document.querySelectorAll('.tech-carousel__track').forEach((track) => {
  const groups = track.querySelectorAll('.tech-carousel__group');
  const source = groups[0];
  const duplicate = groups[1];

  if (source && duplicate) {
    duplicate.replaceChildren(...source.cloneNode(true).children);
  }
});