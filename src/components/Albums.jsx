import React from 'react';

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
          url = url.replace('{w}', 100);
          url = url.replace('{h}', 100);

          return (
              <div>
                <img src={url} style={{width: 100, height: 100}} alt=""/>
                <div>
                  {album.attributes.name}
                </div>
              </div>
          );
        });
  }
}
