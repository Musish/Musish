export function createMediaItem(song) {
  return {
    id: song.id,
    attributes: song.attributes,
    container: {
      id: song.id
    }
  }
}

export function artworkForMediaItem(song, size) {
  return MusicKit.formatArtworkURL(song.attributes.artwork, size, size);
}