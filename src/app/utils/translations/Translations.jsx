import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  // ENGLISH
  en: {
    musishDescription:
      'Musish uses your Apple Music library to provide you with an amazing listening ' +
      'experience. Please connect your account below.',
    connect: 'Connect to Apple Music',
    securityMessage: ' Secure authentication via Apple.com.',
    justBrowse: 'Or just browse',
    legalNotice:
      'Musish is not affiliated with Apple, Inc. Our service does not access, ' +
      "collect, or store any personal or account information. 'Apple', 'Apple Music' and " +
      'the Apple logo are trademarks of Apple, Inc.',

    appleMusic: 'Apple Music',

    logout: 'Logout',
    login: 'Login',
    searchMusic: 'Search music',

    play: 'Play',
    playNext: 'Play Next',
    playLater: 'Play Later',
    shuffle: 'Shuffle',
    search: 'Search',
    searchingFor: 'Searching for ',

    openAlbum: 'Open Album',
    openPlaylist: 'Open Playlist',
    addToPlaylist: 'Add to Playlist',
    addToLibrary: 'Add to Library',

    playlistBy: 'Playlist by ',

    forYou: 'For You',
    recentlyPlayed: 'Recently played',
    heavyRotation: 'Heavy Rotation',

    browse: 'Browse',
    topCharts: 'Top Charts',
    genres: 'Genres',
    topSongs: 'Top Songs',
    dailyTop100: 'Daily Top 100',
    topPlaylists: 'Top Playlists',
    topAlbums: 'Top Albums',

    radio: 'Radio',
    radioMessage: `We're working on bringing Radio to you ASAP. Check back later.`,

    myLibrary: 'My Library',
    recentlyAdded: 'Recently Added',
    artists: 'Artists',
    albums: 'Albums',
    songs: 'Songs',
    playlists: 'Playlists',

    feedback: 'Feedback',
    feedbackMessageOne: 'Designed with ',
    feedbackMessageTwo: ' by the Musish team.',

    lyrics: 'Lyrics',
    upNext: 'Up next',

    showCompleteAlbum: 'Show Complete Album',
    hour: 'hour',
    hours: 'hours',
    minute: 'minute',
    minutes: 'minutes',

    oppsNoResultsFound: 'Opps, no results found.',
    trackNotAvailable: 'Track not available',

    dataProvidedByGenius: 'Data Provided by Genius',
    inYourPersonalLibrary: 'In your personal library',
    youMustLoginToSearchYourLibrary: 'You must login to search your library.',

    noLyricsAvailable: 'No lyrics available ',
  },
  // POLISH
  pl: {
    musishDescription:
      'Musish używa biblioteki Apple Music, aby zapewnić Ci niesamowite wrażenia ' +
      'słuchania Twojej ulubionej muzyki. Połącz się ze swoim kontem poniżej.',
    connect: 'Połącz się z Apple Music',
    securityMessage: ' Bezpieczne uwierzytelnianie przez Apple.com.',
    justBrowse: 'Lub po prostu przeglądaj',
    legalNotice:
      'Musish nie jest stowarzyszona z Apple, Inc. Nasza usługa nie uzyskuje ' +
      'dostępu, nie gromadzi ani nie przechowuje żadnych danych osobowych ani informacji o ' +
      'koncie. "Apple", "Apple Music" i logo Apple są znakami towarowymi firmy Apple, Inc.',

    appleMusic: 'Muzyka Apple',

    logout: 'Wyloguj się',
    login: 'Zaloguj się',
    searchMusic: 'Wyszukaj muzykę',

    play: 'Odtwórz',
    playNext: 'Odtwórz jako następna',
    playLater: 'Odtwórz później',
    shuffle: 'Mieszaj',
    search: 'Szukaj',
    searchingFor: 'Szukasz ',

    openAlbum: 'Otwórz Album',
    openPlaylist: 'Otwórz Playliste',
    addToPlaylist: 'Dodaj do Playlisty',
    addToLibrary: 'Dodaj do Biblioteki',

    playlistBy: 'Playlista przez ',

    forYou: 'Dla Ciebie',
    recentlyPlayed: 'Ostatnio odtwarzane',
    heavyRotation: 'Często odtwarzane',

    browse: 'Przeglądaj',
    topCharts: 'Lista Przebojów',
    genres: 'Gatunki',
    topSongs: 'Najlepsze Utwory',
    dailyTop100: 'Codziennie Najlepsze 100',
    topPlaylists: 'Najlepsze Playlisty',
    topAlbums: 'Najlepsze Albumy',

    radio: 'Radio',
    radioMessage: 'Pracujemy nad dostarczeniem Radia do Ciebie jak najszybciej. Sprawdź później.',

    myLibrary: 'Moja Biblioteka',
    recentlyAdded: 'Ostatnio Dodane',
    artists: 'Artyści',
    albums: 'Albumy',
    songs: 'Utwory',
    playlists: 'Playlisty',

    feedback: 'Twoje Opinie',
    feedbackMessageOne: 'Zaprojektowany z ',
    feedbackMessageTwo: ' przez zespół Musish.',

    lyrics: 'Tekst Piosenki',
    upNext: 'W kolejce',

    showCompleteAlbum: 'Pokaż Pełny Album',
    hour: 'godzina',
    hours: 'godziny',
    minute: 'minuta',
    minutes: 'minuty',

    oppsNoResultsFound: 'Opps, nie znaleziono żadnych wyników.',
    trackNotAvailable: 'Utwór niedostępny',

    dataProvidedByGenius: 'Dane dostarczone przez Genius',
    inYourPersonalLibrary: 'W twojej osobistej bibliotece',
    youMustLoginToSearchYourLibrary: 'Musisz się zalogować, aby przeszukać bibliotekę.',

    noLyricsAvailable: 'Brak dostępnych tekstów ',
  },
});

strings.setLanguage('pl');

export default strings;
