import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageContent from '../../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../../Common/PageTitle/PageTitle';
import Loader from '../../../../../Common/Loader/Loader';
import classes from './CuratorPage.scss';
import { artworkForMediaItem } from '../../../../../../utils/Utils';
import PlaylistItem from '../../../../../Common/PlaylistItem/PlaylistItem';
import InfiniteLoader from '../../../../../Common/InfiniteLoader/InfiniteLoader';
import * as MusicApi from '../../../../../../services/MusicApi';
import Tabs from '../../../../../Common/Tabs/Tabs';
import Tab from '../../../../../Common/Tabs/Tab';

class CuratorPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curatorId: this.props.match.params.id,
      curator: null,
    };

    this.store = {};
    this.scrollRef = React.createRef();

    this.curatorLoader = this.curatorLoader.bind(this);
  }

  componentDidMount() {
    this.fetchCurator();
  }

  async fetchCurator() {
    const music = MusicKit.getInstance();

    const curator = await music.api.appleCurator(this.getCuratorId());

    this.setState({
      curator,
    });
  }

  getCuratorId() {
    return this.state.curatorId;
  }

  curatorLoader() {
    return this.state.curator;
  }

  renderHeader() {
    const { curator } = this.state;

    if (!curator) {
      return null;
    }

    const artwork = artworkForMediaItem(curator, 200);

    const styles = {
      background: `url(${artwork})`,
    };

    return (
      <div className={classes.curatorHeader} style={styles}>
        <div className={classes.curatorHeaderContainer}>
          <div className={classes.curatorHeaderPicture} style={styles} />
        </div>
      </div>
    );
  }

  static getFilters(items) {
    const filtersCount = items
      .map(item => item.filter)
      .filter(f => f)
      .reduce((filters, filter) => {
        if (!filters[filter]) {
          return {
            ...filters,
            [filter]: 1,
          };
        }

        return {
          ...filters,
          [filter]: filters[filter] + 1,
        };
      }, {});

    return Object.keys(filtersCount).reduce((filters, filter) => {
      if (filtersCount[filter] >= 2) {
        return [...filters, filter];
      }

      return filters;
    }, []);
  }

  static renderContent(args, { items }) {
    const filters = CuratorPage.getFilters(items);

    const playlistsRenderer = playlist => (
      <PlaylistItem key={playlist.id} playlist={playlist} size={120} />
    );

    return (
      <Tabs>
        <Tab name={'All'}>
          <div className={classes.searchGrid}>{items.map(playlistsRenderer)}</div>
        </Tab>
        {filters.map(filter => (
          <Tab name={filter} key={filter}>
            <div className={classes.searchGrid}>
              {items.filter(playlist => playlist.filter === filter).map(playlistsRenderer)}
            </div>
          </Tab>
        ))}
      </Tabs>
    );
  }

  static fetchPlaylists(playlists) {
    return Promise.all(
      playlists.map(async playlist => {
        const fullPlaylist = await MusicKit.getInstance().api.playlist(playlist.id);

        const filter = fullPlaylist.attributes.name
          .split(':')
          .slice(1)
          .join(':');
        if (filter) {
          fullPlaylist.filter = filter.replace(/\(.*?\)/g, '').trim();
        }

        return fullPlaylist;
      })
    );
  }

  render() {
    const { curator } = this.state;

    if (!curator) {
      return <Loader />;
    }

    return (
      <PageContent innerRef={this.scrollRef}>
        {this.renderHeader()}
        <PageTitle context={'Genres'} title={curator.attributes.name} />

        <InfiniteLoader
          scrollElement={this.scrollRef}
          load={MusicApi.infiniteLoadRelationships(
            this.getCuratorId(),
            this.curatorLoader,
            'playlists',
            this.store,
            CuratorPage.fetchPlaylists
          )}
          render={CuratorPage.renderContent}
          limit={10}
        />
      </PageContent>
    );
  }
}

CuratorPage.propTypes = {
  id: PropTypes.any,
  match: PropTypes.object,
};

CuratorPage.defaultProps = {
  id: null,
  match: null,
};

export default withRouter(CuratorPage);
