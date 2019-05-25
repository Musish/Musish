import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageContent from '../../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../../Common/PageTitle/PageTitle';
import Loader from '../../../../../Common/Loader/Loader';
import classes from './GenrePage.scss';
import { artworkForMediaItem } from '../../../../../../utils/Utils';
import PlaylistItem from '../../../../../Common/PlaylistItem/PlaylistItem';
import InfiniteLoader from '../../../../../Common/InfiniteLoader/InfiniteLoader';
import * as MusicApi from '../../../../../../services/MusicApi';

class GenrePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curatorId: this.props.match.params.id,
      curator: null,
    };

    this.store = {};
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    this.fetchCurator();
  }

  fetchCurator = async () => {
    const music = MusicKit.getInstance();

    const curator = await music.api.appleCurator(this.getCuratorId());

    this.setState({
      curator,
    });
  };

  getCuratorId = () => this.state.curatorId;

  curatorLoader = () => this.state.curator;

  renderHeader = () => {
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
  };

  static renderContent(args, { items }) {
    return (
      <div className={classes.playlistGrid}>
        {items.map(playlist => (
          <PlaylistItem key={playlist.id} playlist={playlist} size={160} />
        ))}
      </div>
    );
  }

  static fetchPlaylists(playlists) {
    return Promise.all(
      // eslint-disable-next-line no-return-await
      playlists.map(async playlist => await MusicKit.getInstance().api.playlist(playlist.id))
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

        <p>{curator.attributes.editorialNotes.short}</p>

        <InfiniteLoader
          scrollElement={this.scrollRef}
          load={MusicApi.infiniteLoadRelationships(
            this.getCuratorId(),
            this.curatorLoader,
            'playlists',
            this.store,
            GenrePage.fetchPlaylists
          )}
          render={GenrePage.renderContent}
          limit={10}
        />
      </PageContent>
    );
  }
}

GenrePage.propTypes = {
  id: PropTypes.any,
  match: PropTypes.object,
};

GenrePage.defaultProps = {
  id: null,
  match: null,
};

export default withRouter(GenrePage);
