import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { genres } from '../browse';
import classes from '../../../Search/SearchPage.scss';
import Loader from '../../../../../Common/Loader/Loader';
import CuratorItem from '../../../../../Common/CuratorItem/CuratorItem';

class Playlists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genresCurators: null,
    };
  }

  componentDidMount() {
    this.fetchGenres();
  }

  async fetchGenres() {
    const music = MusicKit.getInstance();

    const genresCurators = await music.api.appleCurators(Object.values(genres));

    this.setState({
      genresCurators,
    });
  }

  render() {
    const { genresCurators } = this.state;

    return (
      <>
        <h3>Genres</h3>
        {genresCurators ? (
          <div className={classes.searchGrid}>
            {genresCurators.map(curator => (
              <CuratorItem key={curator.id} curator={curator} size={120} />
            ))}
          </div>
        ) : (
          <Loader />
        )}
      </>
    );
  }
}

export default withRouter(Playlists);
