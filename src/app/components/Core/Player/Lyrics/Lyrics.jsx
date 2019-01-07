import React from 'react';
import PropTypes from 'prop-types';
import backend from '../../../../services/Backend';
import Loader from '../../../common/Loader';

const iframeCss = `
<style>
  body, html {
      margin: 0;
      padding: 0;
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
  }

  async fetchGeniusSong() {
    const { song } = this.props;

    const qsName = encodeURIComponent(song.attributes.name);
    const qsArtist = encodeURIComponent(song.attributes.artistName);

    const { data } = await backend.get(`?name=${qsName}&artist=${qsArtist}`);

    this.setState({
      geniusSong: data,
    });
  }

  componentDidMount() {
    this.fetchGeniusSong();
  }

  render() {
    const { geniusSong } = this.state;

    if (!geniusSong) {
      return <Loader />;
    }

    return (
      <div style={{ flex: 1 }}>
        <iframe
          title={'Lyrics'}
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
