import React from 'react';
import { withRouter } from 'react-router-dom';
import classes from '../BrowsePage.scss';
import browseData from '../browse';
import Loader from '../../../../../Common/Loader/Loader';
import ItemList from '../ItemList';
import * as MusicPlayerApi from '../../../../../../services/MusicPlayerApi';
import TracksGrid from '../../../../../Common/Tracks/TracksGrid/TracksGrid';

class Playlists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charts: null,
    };

    this.ref = React.createRef();
    this.getCharts = this.getCharts.bind(this);
  }

  async getCharts() {
    const music = MusicKit.getInstance();
    const charts = await music.api.charts(['songs', 'albums', 'playlists'], { limit: 36 });

    this.setState({
      charts,
    });
  }

  componentDidMount() {
    this.getCharts();
  }

  static playTrack({ tracks, index }) {
    MusicPlayerApi.playTrack(tracks, index);
  }

  render() {
    const { charts } = this.state;

    return (
      <>
        <h3>Top Songs</h3>
        <div className={classes.chartingSongs}>
          {charts ? (
            <TracksGrid
              tracks={charts.songs[0].data}
              showArtist
              showAlbum
              playTrack={Playlists.playTrack}
            />
          ) : (
            <Loader />
          )}
        </div>

        <ItemList
          title={'Daily Top 100'}
          listIds={Object.values(browseData.top100).slice(0, 24)}
          type={'playlist'}
          size={120}
          rows={1}
        />

        <ItemList
          title={'Top Playlists'}
          list={charts ? charts.playlists[0].data : null}
          type={'playlist'}
        />

        <ItemList
          title={'Top Albums'}
          list={charts ? charts.albums[0].data : null}
          type={'album'}
          size={120}
          rows={3}
        />
      </>
    );
  }
}

export default withRouter(Playlists);
