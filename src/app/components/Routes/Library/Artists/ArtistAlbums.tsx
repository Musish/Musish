import React from 'react';
import translate from '../../../../utils/translations/Translations';
import AlbumPanel from '../../../Common/AlbumPanel/AlbumPanel';
import Loader from '../../../Common/Loader/Loader';
import PageContent from '../../../Common/PageContent/PageContent';
import PageTitle from '../../../Common/PageTitle/PageTitle';
import classes from './ArtistAlbums.scss';

interface ArtistAlbumsProps {
  id: any;
}

interface ArtistAlbumsState {
  artist: any;
}

class ArtistAlbums extends React.Component<ArtistAlbumsProps, ArtistAlbumsState> {
  private readonly pageRef = React.createRef<HTMLDivElement>();

  constructor(props: ArtistAlbumsProps) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  public async componentDidMount() {
    const music = MusicKit.getInstance();

    const { id } = this.props;
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

  public renderArtists = () => {
    const { artist } = this.state;

    return artist.relationships.albums.data.map((album: any) => (
      <AlbumPanel key={album.id} album={album} className={classes.panel} />
    ));
  };

  public renderContent = () => {
    const { artist } = this.state;

    if (!artist) {
      return <Loader />;
    }

    return (
      <>
        <PageTitle title={artist.attributes.name} context={translate.myLibrary} />
        {this.renderArtists()}
      </>
    );
  };

  public render() {
    return <PageContent innerRef={this.pageRef}>{this.renderContent()}</PageContent>;
  }
}

export default ArtistAlbums;
