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
  'pl.deec8b036583481782c40a2a05554b0b', /* top-100-dominican-republic */
  'pl.2fc68f6d68004ae993dadfe99de83877', /* top-100-nigeria */
  'pl.c0e98d2423e54c39b3df955c24df3cc5', /* top-100-india */
  'pl.78f1974e882d4952b26ebfb8e017c933', /* top-100-ghana */
  'pl.d116fa6286734b74acff3d38a740fe0d', /* top-100-colombia */
  'pl.728bd30a9247487c80a483f4168a9dcd', /* top-100-russia */
  'pl.11ac7cc7d09741c5822e8c66e5c7edbb', /* top-100-brazil */
  'pl.18be1cf04dfd4ffb9b6b0453e8fae8f1', /* top-100-australia */
  'pl.b9eb00f9d195440e8b0bdf19b8db7f34', /* top-100-philippines */
  'pl.0c9765e5330048af96c2336fa7bc3525', /* top-100-israel */
  'pl.f1495be1a9774341ab8a1eceb7011579', /* top-100-trinidad */
  'pl.fde851dc95ce4ffbb74028dfd254ced5', /* top-100-china */
  'pl.617da0e0bbb74461b607cad435b1e941', /* top-100-venezuela */
  'pl.737e067787df485a8062e2c4927d94db', /* top-100-italy */
  'pl.741ff34016704547853b953ec5181d83', /* top-100-taiwan */
  'pl.7f35cffa10b54b91aab128ccc547f6ef', /* top-100-hong-kong */
  'pl.7ae8594e422f44658e58212d876d9323', /* top-100-argentina */
  'pl.f3e0d6ef238542609572c18b0de1513b', /* top-100-turkey */
  'pl.569a0034bcc64db68bb13afa8171a687', /* top-100-peru */
  'pl.ec6d493f976349dfb0cba8f6c2f7e937', /* top-100-honduras */
  'pl.cca0d50798424e4e871820a03719e841', /* top-100-antigua-and-barbuda */
  'pl.815f78effb3844909a8259d759ecbddb', /* top-100-ukraine */
  'pl.c509137d97214632a087129ece060a3d', /* top-100-thailand */
  'pl.550110ec6feb4ae0aff364bcde6d1372', /* top-100-vietnam */
  'pl.447bd05172824b89bd745628f7f54c18', /* top-100-south-africa */
  'pl.7235b4236ee241f083f8026d372cc2d8', /* top-100-guatemala */
  'pl.a5365fa3b6ec4a34994339ca100801ae', /* top-100-saudi-arabia */
  'pl.b9e553253ed24c2a829c9c08209e5f67', /* top-100-uganda */
  'pl.9d5ee7c72f804dbab97163616c7a8399', /* top-100-panama */
  'pl.0b36ea82865d4adeb9d1d62207aab172', /* top-100-kenya */
  'pl.9a175d1e9b1e4c81bfa7c63f28c1a79e', /* top-100-el-salvador */
  'pl.41b0d399afea495699dbc7660994a96c', /* top-100-ecuador */
  'pl.42abb2144d594137a8fb4d37a9f35b42', /* top-100-armenia */
  'pl.0c6bea611ad54c79b854299bc515a5a6', /* top-100-romania */
  'pl.8c91cbb0ef4e48308dbbba4238135eaf', /* top-100-poland */
  'pl.0f15f3a8ba014979b9fdd7a0ef906dca', /* top-100-greece */
  'pl.26fb1998d54a4b3192be548529a97f8e', /* top-100-netherlands */
  'pl.7771c20fc0354f64a723ae9c11a4d5f5', /* top-100-costa-rica */
  'pl.b0cc7d688aa94588a640412c9686bf1b', /* top-100-bermuda */
  'pl.a0b3d0b9a2764646b59ccacdf82e3544', /* top-100-egypt */
  'pl.cfcd547b034d47648a16fb8e2df0623f', /* top-100-bolivia */
  'pl.1e2c1286034c49b78139d2b4ff499a94', /* top-100-fiji */
  'pl.917f294713a34cdeb46e67ad2a137067', /* top-100-cape-verde */
  'pl.27d3c4d63b0e41f29f79c98bb5a090e1', /* top-100-kazakhstan */
  'pl.81015bbbefdd46758b2c8c7065f0863e', /* top-100-chile */
  'pl.2b7e089dc9ef4dd7a18429df9c6e26a3', /* top-100-indonesia */
  'pl.05a67957c3974729aac67c01247e55b6', /* top-100-norway */
  'pl.13743dcd86174ea5b4cb6b2534637e23', /* top-100-barbados */
  'pl.cd4a09b0acde49cda246819d9421b26b', /* top-100-niger */
  'pl.71c450d15a9e4440ac5d24c174958225', /* top-100-mongolia */
  'pl.d4b2fe66a810440186c27434fa71072a', /* top-100-british-virgin-islands */
  'pl.ad37160bb16c4c70a1d83d3670e96c1a', /* top-100-zimbabwe */
  'pl.90ad69a600ed4d10b00d158eea68cad7', /* top-100-uzbekistan */
  'pl.838a4daba8924c42969ca7162fdc74da', /* top-100-lebanon */
  'pl.0843e61953c1430287162e5a36dff52b', /* top-100-paraguay */
  'pl.5876877c387b4ffb8860ac3ea2c244c3', /* top-100-sweden */
  'pl.73bb3593281444fb8ab21d58ccab4600', /* top-100-botswana */
  'pl.c6d8b5dcf6814168a4b0262628d3a317', /* top-100-belize */
  'pl.5318aa72adb84bcfac803ecaf6156325', /* top-100-kyrgyzstan */
  'pl.b14c0257c1744d2686f88d05ab1efb4c', /* top-100-grenada */
  'pl.040cf0b4c7e9467eb9eed2d33e7a29d6', /* top-100-bulgaria */
  'pl.5adf310412994d9483918fcd8e091fc5', /* top-100-jordan */
  'pl.a165defeeccb4b17a59bb5c85637b9b7', /* top-100-malaysia */
  'pl.4d763fa1cf15433b9994a14be6a46164', /* top-100-singapore */
  'pl.e4dcd4663130419bb03b80216dee9f57', /* top-100-moldova */
  'pl.2249e0cc6edb46f4ae64de2c937a4f41', /* top-100-nicaragua */
  'pl.48bbe91b5d944b0aa7b1e90a3889b6a7', /* top-100-anguilla */
  'pl.cee165c3a51e466481bde5de75d6dee3', /* top-100-hungary */
  'pl.68e6ad675521400487ea78463b39899d', /* top-100-dominica */
  'pl.ccc31c81303c405baddaaf0f5328b7f3', /* top-100-azerbaijan */
  'pl.7b5e51f09aee4733958e23ea97dda459', /* top-100-uae */
  'pl.cd9b6c35086b43b193ecc3d32882a41e', /* top-100-sri-lanka */
  'pl.cefe84f7916b4cae8b21b0a78e948380', /* top-100-belgium */
  'pl.02a8276fa4ca40b19ac248fda4725fbb', /* top-100-bahrain */
  'pl.bb1f5218a0f04de3877c4f9ccd63d260', /* top-100-switzerland */
  'pl.d8742df90f43402ba5e708eefd6d949a', /* top-100-new-zealand */
  'pl.be7b2d63abaf4d25918ef41187f88be4', /* top-100-st-kitts-and-nevis */
  'pl.9032e70a644e442688f120a829c636cd', /* top-100-nepal */
  'pl.9d9ee12c7734402ab5ab0dc81911822c', /* top-100-cambodia */
  'pl.62e12ecd522d47858321846adcaac43d', /* top-100-gambia */
  'pl.c5a087a907dc44dfbbbd2f471f16a467', /* top-100-cayman-islands */
  'pl.28e8a715012b4ed9b9527100da1e3474', /* top-100-macau */
  'pl.30fbe54afbf846edabdbe00e90095d04', /* top-100-papa-new-guinea */
  'pl.f34430d010a843128337927bba98048b', /* top-100-austria */
  'pl.42b3fe9c75a947ab84a80019e7bcd704', /* top-100-laos */
  'pl.ea75568dc0524a479b818d551a7b3c35', /* top-100-tajikistan */
  'pl.2e50996a5bf44ab78cbb5c34b1992701', /* top-100-slovakia */
  'pl.e447d9ba54254130a76143bf6fdfa65c', /* top-100-czech-republic */
  'pl.e96de57d836e42dca30f7da24c64bbea', /* top-100-lithuania */
  'pl.e7374de32aec446c92136234d5bcae2f', /* top-100-slovenia */
  'pl.acea41a017664a8ebcd5aa1622aecc88', /* top-100-finland */
  'pl.5ac047a9ada144aebb9b2f16f5bc8c1d', /* top-100-latvia */
  'pl.054734b06c7742a985805f45a283bcb4', /* top-100-estonia */
  'pl.50c1747c37404a9aa07acc39316f6873', /* top-100-belarus */
  'pl.d4ca5698caf04a9f873861c3659aeeca', /* top-100-oman */
  'pl.bee910bc105b43c28eed7d20e4e09a8c', /* top-100-micronesia */
  'pl.046c3e297666475aa84c12159a954596', /* top-100-swaziland */
  'pl.5e6efed969354b378770c2ea6f2fed6b', /* top-100-mauritius */
  'pl.2f85377267d74a13be02a53882a5b488', /* top-100-luxembourg */
  'pl.a5ae21745d1d45edacb68971746d31ae', /* top-100-cyprus */
  'pl.f783d8aec4df401583434a2454adbc3d', /* top-100-turkmenistan */
  'pl.06ab782ba2324ae49317d6bde84eef56', /* top-100-malta */
  'pl.ac455234996b468b9f58e573752ab05c', /* top-100-guinea-bissau */
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
