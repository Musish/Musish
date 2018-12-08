export function createMediaItem(song) {
  return {
    id: song.id,
    attributes: song.attributes,
    container: {
      id: song.id
    }
  }
}