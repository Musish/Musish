import React from 'react';
import * as MusicPlayerApi from '../../../../../services/MusicPlayerApi';
import translate from '../../../../../utils/translations/Translations';
import Loader from '../../../../Common/Loader/Loader';
import TracksGrid from '../../../../Common/Tracks/TracksGrid/TracksGrid';
import browseData from '../browse.json';
import ItemList from '../ItemList';

interface TopChartsState {
  charts: any;
}

class TopCharts extends React.Component<{}, TopChartsState> {
  public static playTrack({ tracks, index }: { tracks: MusicKit.MediaItem[]; index: number }) {
    MusicPlayerApi.playTrack(tracks, index);
  }

  constructor(props: {}) {
    super(props);

    this.state = {
      charts: null,
    };
  }

  public componentDidMount() {
    this.getCharts();
  }

  public getCharts = async () => {
    const music = MusicKit.getInstance();
    const charts = await music.api.charts(['songs', 'albums', 'playlists'], { limit: 36 });

    this.setState({
      charts,
    });
  };

  public render() {
    const { charts } = this.state;

    return (
      <>
        <h3>{translate.topSongs}</h3>
        <div>
          {charts ? (
            <TracksGrid
              tracks={charts.songs[0].data}
              showArtist
              showAlbum
              playTrack={TopCharts.playTrack}
            />
          ) : (
            <Loader />
          )}
        </div>

        <ItemList
          title={translate.dailyTop100}
          itemIds={Object.values(browseData.top100).slice(0, 24)}
          type={'playlist'}
          size={120}
          rows={1}
        />

        <ItemList
          title={translate.topPlaylists}
          items={charts ? charts.playlists[0].data : null}
          type={'playlist'}
        />

        <ItemList
          title={translate.topAlbums}
          items={charts ? charts.albums[0].data : null}
          type={'album'}
          size={120}
          rows={3}
        />
      </>
    );
  }
}

export default TopCharts;
