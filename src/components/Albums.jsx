import React, {Fragment} from 'react';

import AlbumItem from './AlbumItem';

import AlbumScss from './Albums.scss';
import PageTitle from "./PageTitle";

export default class Albums extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();

    const albums = await music.api.library.albums();

    this.setState({
      albums,
    });
  }

  render() {
    if (!this.state.albums) {
      return 'Loading...';
    }

    const albums = this.state.albums.map(
      (album, i) => {
        let url = album.attributes.artwork.url;
        url = url.replace('{w}', 150);
        url = url.replace('{h}', 150);

        return (
            <div key={i}>
              <AlbumItem url={url} title={album.attributes.name} name={album.attributes.artistName}/>
            </div>
        );
      });

    return (
      <Fragment>
        <PageTitle title={"Albums"} context={"Your Library"} />
        <div className={AlbumScss.container}>
          { albums }
        </div>
      </Fragment>
    )
  }
}
