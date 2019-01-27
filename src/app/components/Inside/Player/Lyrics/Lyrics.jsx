import React from 'react';
import PropTypes from 'prop-types';
import classes from './LyricsModal.scss';

import backend from '../../../../services/Backend';
import Loader from '../../../Common/Loader/Loader';
import translate from '../../../../utils/translations/Translations';

const iframeCss = `
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<style>
  body, html {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Roboto', sans-serif;
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

class Lyrics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geniusSong: null,
    };

    this.fetchGeniusSong = this.fetchGeniusSong.bind(this);
  }

  async fetchGeniusSong() {
    const { song } = this.props;

    const qsName = encodeURIComponent(song.attributes.name);
    const qsArtist = encodeURIComponent(song.attributes.artistName);

    const { data } = await backend.get(`/genius/song?name=${qsName}&artist=${qsArtist}`);

    this.setState({
      geniusSong: data || false,
    });
  }

  componentDidMount() {
    this.fetchGeniusSong();
  }

  render() {
    const { geniusSong } = this.state;

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
          frameBorder="0"
          style={{ height: '100%', width: '100%' }}
          seamless
        />
      </div>
    );
  }
}

Lyrics.propTypes = {
  song: PropTypes.any.isRequired,
};

export default Lyrics;
