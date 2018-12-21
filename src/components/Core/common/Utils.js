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

  let humanReadable = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours > 0) {
    humanReadable = `${hours} hour${hours > 1 ? 's' : ''}, ${humanReadable}`;
  }

  return humanReadable;
}

export function isCurrentItem(song) {
  const music = MusicKit.getInstance();

  const mediaItem = music.player && music.player.nowPlayingItem;

  if (!mediaItem) {
    return false;
  }

  return song.id === mediaItem.container.id;
}

export function isPlaying(song) {
  return isCurrentItem(song) && MusicKit.getInstance().player.isPlaying;
}

export const appleCuratorsIds = [
  '976439528', /* blues */
  '988581516', /* rock */
  '988556214', /* alternative */
  '988588080', /* pop */
  '989061185', /* hip-hop */
  '976439542', /* jazz */
  '988583890', /* r&b/soul */
  '989074778', /* dance */
  '988658201', /* metal */
  '989076708', /* electronic */
  '989071074', /* classical */
  '976439534', /* country */
  '982347996', /* new-artists */
  '988658197', /* k-pop */
  '976439552', /* reggae */
  '988578699', /* singer/songwriter */
  '988656348', /* african */
  '976439529', /* inspirational */
  '976439587', /* world */
  '988578275', /* stage & screen */
  '1053601584', /* christmas */
  '989066661', /* childrens-music */
];

export const featuredPlaylistsIds = [
  'pl.f4d106fed2bd41149aaacabb233eb5eb', /* todays-hits */
  'pl.567c541f63414e798be5cf214e155557', /* today-at-apple */
  'pl.4589a0c55c9e462e9d3cb17964f5bda6', /* mellow-days */
  'pl.725376c1e6b14915b7e27a919db39c52', /* easy-hits */
  'pl.03cac344bd5641cfb59d39626f62d098', /* headliners */
  'pl.299001f6c528460797ea61bac6522a81', /* guitar-throwback */
  'pl.f19f6b5be8474fe789e36a6242f6113e', /* new-fire */
  'pl.0d4aee5424c74d29ad15252eeb43d3b1', /* feeling-happy */
  'pl.91bb14d8ee10414e8fda8fb71f56db03', /* friday-feeling */
  'pl.5cc71a7325f8405c8c420ea382d66040', /* relax */
  'pl.a0214a4b459d4f79a991d1151e6f211f', /* future-hits */
  'pl.cc0486f6236d482da2362e5dcd6d9b3e', /* pure-throwback */
  'pl.acb576c15091494a9ed6dfc5c3f33957', /* all-the-way-up */
  'pl.b5e8dbe8a706496496e1292466839207', /* acoustic-chill */
  'pl.2d4d74790f074233b82d07bfae5c219c', /* its-lit */
  'pl.c21556629e97453f9672feb9d8f228a3', /* pop-throwback */
  'pl.2b0e6e332fdf4b7a91164da3162127b5', /* best-of-the-week */
  'pl.c6b0ecb695eb4fcea3476050fdb4e1bb', /* unwind */
  'pl.dbd712beded846dca273d5d3259d28aa', /* pure-focus */
];

export const top100Ids = [
  'pl.d25f5d1181894928af76c85c967f8f31', /* top-100-global */
  'pl.c2273b7e89b44121b3093f67228918e7', /* top-100-uk */
  'pl.3b47111ed6b7461eae67fadf895d56db', /* top-100-ireland */
  'pl.606afcbb70264d2eb2b51d8dbcfa6a12', /* top-100-usa */
  'pl.79bac9045a2540e0b195e983df8ba569', /* top-100-canada */
  'pl.df3f10ca27b1479087de2cd3f9f6716b', /* top-100-mexico */
  'pl.18be1cf04dfd4ffb9b6b0453e8fae8f1', /* top-100-australia */
  'pl.043a2c9876114d95a4659988497567be', /* top-100-japan */
  'pl.0d656d7feae64198bc5fb1b02786ed75', /* top-100-spain */
  'pl.6e8cfd81d51042648fa36c9df5236b8d', /* top-100-france */
  'pl.c10a2c113db14685a0b09fa5834d8e8b', /* top-100-germany */
  'pl.d3d10c32fbc540b38e266367dc8cb00c', /* top-100-south-korea */
];

export const aListPlaylistsIds = [
  'pl.a9faca07cf8f47e19f1819b0f5a2e765', /* the-a-list-blues */
  'pl.0b593f1142b84a50a2c1e7088b3fb683', /* the-a-list-alternative */
  'pl.5ee8333dbe944d9f9151e97d92d1ead9', /* the-a-list-pop */
  'pl.58c2477d86ea46db997048afd159d01d', /* a-list-hard-rock */
  'pl.abe8ba42278f4ef490e3a9fc5ec8e8c5', /* the-a-list-hip-hop */
  'pl.07405f59596b402385451fa14695eec4', /* the-a-list-jazz */
  'pl.b7ae3e0a28e84c5c96c4284b6a6c70af', /* the-a-list-r-b */
  'pl.6bf4415b83ce4f3789614ac4c3675740', /* the-a-list-dance */
  'pl.51c1d571cc7b484eb1dead1939811f2d', /* the-a-list-metal */
  'pl.4705ab1ed97c4f4bb54f48940faf5623', /* the-a-list-electronic */
  'pl.a0794db8bc6f45888834fa708a674987', /* the-a-list-african */
  'pl.66c17ed5cc754856b944a9150483e375', /* the-a-list-classical */
  'pl.87bb5b36a9bd49db8c975607452bfa2b', /* the-a-list-country */
  'pl.704f234023a543dfb4bfb34b426c27d1', /* the-a-list-new-artists */
  'pl.48229b41bbfc47d7af39dae8e8b5276e', /* the-a-list-k-pop */
  'pl.e75fb4f0f6f649a89f7c28ef4cc0442f', /* the-a-list-reggae */
  'pl.8e78f32951a4462f9f4d369c006bc97d', /* the-a-list-singer-songwriter */
  'pl.19886d42a5cf41fcbcd277b519dd9e6a', /* a-list-uk */
  'pl.d60caf02fcce4d7e9788fe01243b7c2c', /* a-list-bollywood */
  'pl.fecfa8a26ea44ad581d4fe501892c8ff', /* a-list-christian */
];

export const curatorsIds = [
  '1231985718', /* ministry-of-sound */
  '1114653141', /* bbc-music */
  '999976862', /* shazam */
  '1176303175', /* capital */
  '1110093882', /* beats-by-dr-dre */
  '1151621339', /* nike */
  '1019272989', /* this-is */
  '1022031818', /* topsify */
  '1114613681', /* steinway-sons */
  '1271525907', /* peaceful-music */
  '1033686287', /* future-classic */
  '1163862189', /* ea-music */
  '1203471375', /* victorias-secret */
  '1081083320', /* sonos */
  '1055418988', /* gq */
  '1089330276', /* blue-note-records */
  '1102503115', /* real-world-records */
  '999976483', /* nme */
  '999963781', /* vice */
  '1072959111', /* bbc-music-magazine */
  '1173615171', /* abbey-road-studios */
  '976439460', /* rolling-stone */
];

export const RepeatModeNone = 0;
export const RepeatModeOne = 1;
export const RepeatModeAll = 2;

export const ShuffleModeOff = 0;
export const ShuffleModeSongs = 1;

export const API_URL = 'https://api.music.apple.com';
