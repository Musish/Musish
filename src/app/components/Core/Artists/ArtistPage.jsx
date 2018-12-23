import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classes from './ArtistPage.scss';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import AlbumItem from '../Albums/AlbumItem';

class ArtistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();

    const { id } = this.props.match.params;
    const isCatalog = /^\d+$/.test(id);

    let artist;
    if (isCatalog) {
      artist = await music.api.artist(id, { include: 'albums' });
    } else {
      artist = await music.api.library.artist(id, { include: 'albums' });
    }

    this.setState({
      artist,
    });
  }

  render() {
    const { artist } = this.state;

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={artist ? artist.attributes.name : 'Artist'} context={'Apple Music'} />

        {artist && (
          <div className={classes.albumsGrid}>
            {artist.relationships.albums.data.map(album => (
              <AlbumItem key={album.id} album={album} size={120} />
            ))}
          </div>
        )}
      </PageContent>
    );
  }
}

ArtistPage.propTypes = {
  match: PropTypes.any,
};

ArtistPage.defaultProps = {
  match: null,
};

export default withRouter(ArtistPage);
