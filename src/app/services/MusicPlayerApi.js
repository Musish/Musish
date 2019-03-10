import _shuffle from 'lodash/shuffle';
import { createMediaItem } from '../utils/Utils';

let originalQueue = null;

export async function playTrack(tracks, index) {
  const music = MusicKit.getInstance();
  await setQueueItems(tracks, index);
  await music.player.play();
}

export async function playAlbum(album, index) {
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

export async function shufflePlayAlbum(album) {
  const music = MusicKit.getInstance();
  const queue = _shuffle(album.relationships.tracks.data);
  await setQueueItems(queue, 0);
  await music.player.play();
}

export async function playPlaylist(playlist, index) {
  const music = MusicKit.getInstance();
  let playlistData = playlist;
  if (!playlistData.relationships || !playlistData.relationships.tracks) {
    playlistData = playlist.id.startsWith('p.')
      ? await music.api.library.playlist(playlist.id)
      : await music.api.playlist(playlist.id);
  }
  await setQueueItems(playlistData.relationships.tracks.data, index);
  await music.player.play();
}

export async function shufflePlayPlaylist(playlist) {
  const music = MusicKit.getInstance();
  const queue = _shuffle(playlist.relationships.tracks.data);
  await setQueueItems(queue, 0);
  await music.player.play();
}

export async function playNext(item) {
  let items;
  const music = MusicKit.getInstance();
  if (item.type === 'songs' || item.type === 'library-songs') {
    items = [item];
  } else if (item.type === 'albums' || item.type === 'library-albums') {
    let albumData = item;
    if (!albumData.relationships || !albumData.relationships.tracks) {
      albumData = isNaN(item.id)
        ? await music.api.library.album(item.id)
        : await music.api.album(item.id);
    }
    items = albumData.relationships.tracks.data;
  } else if (item.type === 'playlists' || item.type === 'library-playlists') {
    let playlistData = item;
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

export async function playLater(item) {
  let items;
  const music = MusicKit.getInstance();
  if (item.type === 'songs' || item.type === 'library-songs') {
    items = [item];
  } else if (item.type === 'albums' || item.type === 'library-albums') {
    let albumData = item;
    if (!albumData.relationships || !albumData.relationships.tracks) {
      albumData = isNaN(item.id)
        ? await music.api.library.album(item.id)
        : await music.api.album(item.id);
    }
    items = albumData.relationships.tracks.data;
  } else if (item.type === 'playlists' || item.type === 'library-playlists') {
    let playlistData = item;
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

export async function seekToTime(time) {
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
    const newQueue = originalQueue;

    originalQueue = null;
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

export async function setQueueItems(items, index) {
  const s = {
    items: items.map(createMediaItem),
    startPosition: index,
  };

  s.startPosition = index;

  if (isNaN(index)) {
    s.startPosition = MusicKit.getInstance().player.queue.position;
  }

  await MusicKit.getInstance().setQueue(s);
}

export async function prependQueueItems(items) {
  const s = { items: items.map(createMediaItem) };
  await MusicKit.getInstance().player.queue.prepend(s);
}

export async function appendQueueItems(items) {
  const s = { items: items.map(createMediaItem) };
  await MusicKit.getInstance().player.queue.append(s);
}

function isSame(a, b) {
  return (
    a &&
    b &&
    (a.id === b.id ||
      (b.container && a.id === b.container.id) ||
      (a.container && b.id === a.container.id))
  );
}

export function isCurrentTrack(track) {
  const playing = getPlayingItem();

  if (!playing) {
    return false;
  }

  return isSame(track, playing);
}

export function isPlaying() {
  return MusicKit.getInstance().player.isPlaying;
}

export function isTrackPlaying(track) {
  return MusicKit.getInstance().player.isPlaying && isCurrentTrack(track);
}
