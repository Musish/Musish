export function createMediaItem(song) {
  return {
    id: song.id,
    attributes: song.attributes,
    container: {
      id: song.id
    }
  }
}

export function artworkForMediaItem(item, size) {
  return MusicKit.formatArtworkURL(item.attributes.artwork, size, size);
}

export function humanifyMillis(duration) {
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  let humanReadable = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours > 0) {
    humanReadable = `${hours} hour${hours > 1 ? 's' : ''}, ${humanReadable}`;
  }

  return humanReadable;
}