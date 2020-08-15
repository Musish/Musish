import React, { useEffect, useState } from 'react';
import backend from '../../../../services/Backend';
import translate from '../../../../utils/translations/Translations';
import Loader from '../../Loader/Loader';
import classes from './LyricsModal.scss';

// It is not possible to assign CSS dynamically by traversing the DOM in Javascript, the iframe's child elements cannot be accessed.
// It is also not possible to use the embedded content's class-names and assign properties to them in our own CSS files - these will not be applied.
// Our only option seems to be to compile and enter CSS dynamically into the below variable.
// Consider: "https://sass-lang.com/documentation/js-api"
const iframeCss = `
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<style>
  body, html {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Roboto', sans-serif;

      scrollbar-width: thin;
      scrollbar-color: #ffa7b8 #fff;
  }

  html {
    padding-right: 6px;
  }

  // :hover selector is not used because it behaves strangely in here

  :active {
    scrollbar-color: #fe839b #fff;
  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    border-radius: 99px;
  }

  ::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 99px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ffa7b8;
    border-radius: 99px;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb:active {
    background: #fe839b;
  }

  ::-webkit-scrollbar-corner {
    display: none;
  }

  .rg_embed_body * {
    background: none !important;
    color: #000 !important;
    pointer-events: none !important;
    cursor: default !important;
  }
  
  .rg_embed {
      margin: 0;
      width: 100%;
  }
</style>
`;

interface LyricsProps {
  song: MusicKit.MediaItem;
}

const Lyrics: React.FC<LyricsProps> = ({ song }: LyricsProps) => {
  const [geniusSong, setGeniusSong] = useState<false | any>(null);

  async function fetchGeniusSong() {
    const qsName = encodeURIComponent(song.attributes.name);
    const qsArtist = encodeURIComponent(song.attributes.artistName);

    const { data } = await backend.get(`/genius/song?name=${qsName}&artist=${qsArtist}`);

    setGeniusSong(data || false);
  }

  useEffect(() => {
    fetchGeniusSong();
  }, []);

  if (geniusSong === false) {
    return (
      <div className={classes.noMatch}>
        {translate.noLyricsAvailable}
        <span role={'img'} aria-label={'crying'}>
          😢
        </span>
      </div>
    );
  }

  if (!geniusSong) {
    return <Loader />;
  }

  return (
    <div className={classes.lyricsSection}>
      <iframe
        title={translate.lyrics}
        srcDoc={geniusSong.embed_content + iframeCss}
        frameBorder='0'
        style={{ height: '100%', width: '100%' }}
        seamless
      />
    </div>
  );
};

export default Lyrics;
