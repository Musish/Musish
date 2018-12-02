import React, { Fragment } from 'react';
import PageTitle from "./PageTitle";

export default class Artists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();

    const artists = await music.api.library.artists();

    console.log(artists);

    this.setState({
      artists,
    });
  }

  render() {
    if (!this.state.albums) {
      return 'Loading...';
    }

    const albums = this.state.albums.map(
      (album, i) => {
        const WHEIGHT = 150;
        let url = MusicKit.formatArtworkURL(album.attributes.artwork, WHEIGHT, WHEIGHT);

        return (
          <div key={i}>
            <AlbumItem url={url} title={album.attributes.name} name={album.attributes.artistName}/>
          </div>
        );
      });

    return (
      <Fragment>
        <PageTitle title={"Albums"} context={"Your Library"} />
        <div className={ArtistsScss.container}>
          { albums }
        </div>
      </Fragment>
    )
  }
}
