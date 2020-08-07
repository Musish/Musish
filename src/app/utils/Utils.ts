import translate from './translations/Translations';

export function createMediaItem(song: MusicKit.MediaItem, container: any = null) {
  if (container) {
    const containerName =
      container.type === 'albums' || container.type === 'library-albums' ? 'albums' : 'playlists';

    return {
      ...song,
      container: {
        id: container.id,
        type: container.type,
        name: containerName,
      },
    };
  }

  return {
    ...song,
    container: {
      id: song.id,
    },
  };
}

export function artworkForMediaItem(item: MusicKit.MediaItem, size: number) {
  if (!item.attributes || !item.attributes.artwork) {
    return `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
  }

  return MusicKit.formatArtworkURL(item.attributes.artwork, size, size);
}

export function getTime(ms: number) {
  if (!ms || isNaN(ms)) {
    ms = 0;
  }
  const s = 1000 * Math.round(ms / 1000);
  const d = new Date(s);

  return `${d.getUTCMinutes()}:${String(`0${d.getUTCSeconds()}`).slice(-2)}`;
}

export function humanifyMillis(duration: number) {
  const musickitDuration = MusicKit.formattedMilliseconds(duration);

  const hourFormatted = musickitDuration.hours === 1 ? translate.hour : translate.hours;
  const hours = musickitDuration.hours === 0 ? '' : `${musickitDuration.hours} ${hourFormatted}`;
  const minuteFormatted = musickitDuration.minutes === 1 ? translate.minute : translate.minutes;
  const minutes =
    musickitDuration.minutes === 0 ? '' : `${musickitDuration.minutes} ${minuteFormatted}`;
  const comma = musickitDuration.hours === 0 || musickitDuration.minutes === 0 ? '' : `, `;

  return `${hours}${comma}${minutes}`;
}

export function humanifyTrackNumbers(trackNumber: number) {
  const songs = trackNumber === 1 ? translate.song : translate.songs;

  return `${trackNumber} ${songs}`;
}

export const RepeatModeNone = 0;
export const RepeatModeOne = 1;
export const RepeatModeAll = 2;

export const ShuffleModeOff = 0;
export const ShuffleModeSongs = 1;

export const API_URL = 'https://api.music.apple.com';

export const getRatingUrl = (type: string, id: any) => {
  const baseUrl = `${API_URL}/v1/me/ratings/`;
  const endpoints = {
    library: {
      song: 'library-songs',
      playlist: 'library-playlists',
      album: 'library-playlists',
    },
    catalog: {
      song: 'songs',
      playlist: 'playlists',
      album: 'albums',
    },
  };

  const choice: any = isNaN(id) ? endpoints.library : endpoints.catalog;
  if (!(type in choice)) {
    return false;
  }

  return `${baseUrl}${choice[type]}/${id}`;
};

export function setPseudoRoute(route: string) {
  window.history.pushState('', '', route);
}

// TODO: Replace this with comprehensive validation of API responses.
export function hasAttributes(resource: any): boolean {
  return !!resource.attributes;
}
