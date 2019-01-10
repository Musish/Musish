export function createMediaItem(song) {
  // eslint-disable-next-line no-param-reassign
  song.container = { id: song.id };

  return song;
}

export function artworkForMediaItem(item, size) {
  if (!item.attributes || !item.attributes.artwork) {
    return `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
  }

  return MusicKit.formatArtworkURL(item.attributes.artwork, size, size);
}

export function getTime(ms) {
  const s = 1000 * Math.round(ms / 1000);
  const d = new Date(s);

  return `${d.getUTCMinutes()}:${String(`0${d.getUTCSeconds()}`).slice(-2)}`;
}

export function humanifyMillis(duration) {
  const minutes = parseInt((duration / (1000 * 60)) % 60, 10);
  const hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

  let humanReadable = `${minutes} minute${minutes > 1 || minutes === 0 ? 's' : ''}`;
  if (hours > 0) {
    humanReadable = `${hours} hour${hours > 1 || hours === 0 ? 's' : ''}, ${humanReadable}`;
  }

  return humanReadable;
}

export const RepeatModeNone = 0;
export const RepeatModeOne = 1;
export const RepeatModeAll = 2;

export const ShuffleModeOff = 0;
export const ShuffleModeSongs = 1;

export const API_URL = 'https://api.music.apple.com';
