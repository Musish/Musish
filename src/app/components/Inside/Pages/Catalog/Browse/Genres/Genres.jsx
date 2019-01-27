import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { genres } from '../browse';
import classes from '../../../Search/SearchPage.scss';
import Loader from '../../../../../Common/Loader/Loader';
import GenreItem from '../../../../../Common/GenreItem/GenreItem';
import translate from '../../../../../../utils/translations/Translations';

class Genres extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genreCurators: null,
    };
  }

  componentDidMount() {
    this.fetchGenres();
  }

  async fetchGenres() {
    const music = MusicKit.getInstance();

    const genreCurators = await music.api.appleCurators(Object.values(genres));

    genreCurators.map(genre => {
      const updatedGenre = genre;
      updatedGenre.attributes.name = updatedGenre.attributes.name.replace(translate.appleMusic, '');
      return updatedGenre;
    });

    this.setState({
      genreCurators,
    });
  }

  render() {
    const { genreCurators } = this.state;

    return genreCurators ? (
      <div className={classes.searchGrid}>
        {genreCurators.map(genre => (
          <GenreItem key={genre.id} curator={genre} size={120} />
        ))}
      </div>
    ) : (
      <Loader />
    );
  }
}

export default withRouter(Genres);
