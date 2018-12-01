import React from 'react';

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
    if (!this.state.artists) {
      return 'Loading...';
    }

    return this.state.artists.map(
        (artist) => {
          return (
              <div>
                <div>
                  {artist.attributes.name}
                </div>
              </div>
          );
        });
  }
}
