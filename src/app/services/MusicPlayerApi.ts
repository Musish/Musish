import _shuffle from 'lodash/shuffle';
import { createMediaItem } from '../utils/Utils';

let originalQueue: MusicKit.MediaItem[] | null = null;

export async function playTrack(tracks: MusicKit.MediaItem[], index: number) {
  const music = MusicKit.getInstance();
  await setQueueItems(tracks, index);
  await music.player.play();
}

export async function playAlbum(album: MusicKit.Resource, index: number) {
  const music = MusicKit.getInstance();

  let albumData = album;
  if (!albumData.relationships || !albumData.relationships.tracks) {
    albumData = isNaN(album.id)
      ? await music.api.library.album(album.id)
      : await music.api.album(album.id);
  }

  await setQueueItems(albumData.relationships.tracks.data, index);

  await music.player.play();
}

export async function shufflePlayAlbum(album: MusicKit.Resource) {
  const music = MusicKit.getInstance();
  const queue = _shuffle(album.relationships.tracks.data);
  await setQueueItems(queue, 0, album);
  await music.player.play();
}

export async function playPlaylist(playlist: MusicKit.Resource, index: number) {
  const music = MusicKit.getInstance();
  let playlistData = playlist;
  if (!playlistData.relationships || !playlistData.relationships.tracks) {
    playlistData = playlist.id.startsWith('p.')
      ? await music.api.library.playlist(playlist.id)
      : await music.api.playlist(playlist.id);
  }
  await setQueueItems(playlistData.relationships.tracks.data, index, playlist);
  await music.player.play();
}

export async function shufflePlayPlaylist(playlist: MusicKit.Resource) {
  const music = MusicKit.getInstance();
  const queue = _shuffle(playlist.relationships.tracks.data);
  await setQueueItems(queue, 0, playlist);
  await music.player.play();
}

export async function playNext(item: MusicKit.MediaItem) {
  let items;
  const music = MusicKit.getInstance();
  if (item.type === 'songs' || item.type === 'library-songs') {
    items = [item];
  } else if (item.type === 'albums' || item.type === 'library-albums') {
    let albumData = item as any;
    if (!albumData.relationships || !albumData.relationships.tracks) {
      albumData = isNaN((item.id as unknown) as number)
        ? await music.api.library.album(item.id)
        : await music.api.album(item.id);
    }
    items = albumData.relationships.tracks.data;
  } else if (item.type === 'playlists' || item.type === 'library-playlists') {
    let playlistData = item as any;
    if (!playlistData.relationships || !playlistData.relationships.tracks) {
      playlistData = item.id.startsWith('p.')
        ? await music.api.library.playlist(item.id)
        : await music.api.playlist(item.id);
    }
    items = playlistData.relationships.tracks.data;
  } else {
    return;
  }
  await prependQueueItems(items);
}

export async function playLater(item: MusicKit.MediaItem) {
  let items;
  const music = MusicKit.getInstance();
  if (item.type === 'songs' || item.type === 'library-songs') {
    items = [item];
  } else if (item.type === 'albums' || item.type === 'library-albums') {
    let albumData = item as any;
    if (!albumData.relationships || !albumData.relationships.tracks) {
      albumData = isNaN((item.id as unknown) as number)
        ? await music.api.library.album(item.id)
        : await music.api.album(item.id);
    }
    items = albumData.relationships.tracks.data;
  } else if (item.type === 'playlists' || item.type === 'library-playlists') {
    let playlistData = item as any;
    if (!playlistData.relationships || !playlistData.relationships.tracks) {
      playlistData = item.id.startsWith('p.')
        ? await music.api.library.playlist(item.id)
        : await music.api.playlist(item.id);
    }
    items = playlistData.relationships.tracks.data;
  } else {
    return;
  }
  await appendQueueItems(items);
}

export async function play() {
  await MusicKit.getInstance().player.play();
}
export async function pause() {
  await MusicKit.getInstance().player.pause();
}
export async function togglePlayback() {
  const { player } = MusicKit.getInstance();
  if (isPlaying()) {
    await player.pause();
  } else {
    await player.play();
  }
}

export async function seekToTime(time: number) {
  await MusicKit.getInstance().player.seekToTime(time);
}

export function getPlayingItem() {
  return MusicKit.getInstance().player.nowPlayingItem;
}

export async function shuffle() {
  const currentQueue = getQueueItems();
  if (!isShuffled()) {
    originalQueue = [...currentQueue];
  }

  const newQueue = _shuffle(currentQueue);
  newQueue[MusicKit.getInstance().player.queue.position] = getPlayingItem();

  await setQueueItems(newQueue);

  const wasPlaying = isPlaying();
  setImmediate(() => {
    if (wasPlaying) {
      play(); // TODO: Work out a better way to keep the track playing...
    }
  });
}

export async function unShuffle() {
  if (isShuffled()) {
    let newQueue = originalQueue;

    originalQueue = null;

    if (newQueue === null) {
      newQueue = [];
    }

    await setQueueItems(newQueue);
  }

  const wasPlaying = isPlaying();
  setImmediate(() => {
    if (wasPlaying) {
      play(); // TODO: Work out a better way to keep the track playing...
    }
  });
}

export function isShuffled() {
  return originalQueue !== null;
}

export function getQueueItems() {
  return MusicKit.getInstance().player.queue.items;
}

export async function setQueueItems(items: MusicKit.MediaItem[], index = 0, container: any = null) {
  const startPosition = !isNaN(index) ? index : MusicKit.getInstance().player.queue.position;

  await MusicKit.getInstance().setQueue({
    // @ts-ignore
    items: items.map(item => createMediaItem(item, container)),
  });

  await MusicKit.getInstance().player.changeToMediaAtIndex(startPosition);
}

export async function prependQueueItems(items: MusicKit.MediaItem[], container = null) {
  const s = { items: items.map(item => createMediaItem(item, container)) };
  await MusicKit.getInstance().player.queue.prepend(s);
}

export async function appendQueueItems(items: MusicKit.MediaItem[], container = null) {
  const s = { items: items.map(item => createMediaItem(item, container)) };
  // @ts-ignore
  await MusicKit.getInstance().player.queue.append(s);
}

function isSame(a: any, b: any) {
  return (
    a &&
    b &&
    (a.id === b.id ||
      (b.container && a.id === b.container.id) ||
      (a.container && b.id === a.container.id))
  );
}

export function isCurrentTrack(track: MusicKit.MediaItem) {
  const playing = getPlayingItem();

  if (!playing) {
    return false;
  }

  return isSame(track, playing);
}

export function isPlaying() {
  return MusicKit.getInstance().player.isPlaying;
}

export function isTrackPlaying(track: MusicKit.MediaItem) {
  return MusicKit.getInstance().player.isPlaying && isCurrentTrack(track);
}
