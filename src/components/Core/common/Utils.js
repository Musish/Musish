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
  if (!item.attributes || !item.attributes.artwork) {
    return `https://is4-ssl.mzstatic.com/image/thumb/Features19/v4/50/f0/d1/50f0d1ac-cf2d-de77-c5c2-73a3170c098e/source/${size}x${size}bb.jpeg`
  }
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

export const RepeatModeNone = 0;
export const RepeatModeOne = 1;
export const RepeatModeAll = 2;

export const ShuffleModeOff = 0;
export const ShuffleModeSongs = 1;
