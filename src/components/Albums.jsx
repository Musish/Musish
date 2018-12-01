import React from 'react';

import AlbumItem from './AlbumItem';

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

    return this.state.albums.map(
        album => {
          let url = album.attributes.artwork.url;
          url = url.replace('{w}', 150);
          url = url.replace('{h}', 150);

          console.log("Works?");

          return (
              <div>
                <AlbumItem url={url} title={album.attributes.name} name={album.attributes.artistName}/>
              </div>
          );
        });
  }
}
