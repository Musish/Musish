import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import translate from '../../../../../utils/translations/Translations';
import GenreItem from '../../../../Common/GenreItem/GenreItem';
import Loader from '../../../../Common/Loader/Loader';
import classes from '../../../Search/SearchPage.scss';
import { genres } from '../browse.json';

type GenresProps = RouteComponentProps;

interface GenresState {
  genreCurators: any | null;
}

class Genres extends React.Component<GenresProps, GenresState> {
  constructor(props: GenresProps) {
    super(props);

    this.state = {
      genreCurators: null,
    };
  }

  public componentDidMount() {
    this.fetchGenres();
  }

  public fetchGenres = async () => {
    const music = MusicKit.getInstance();

    const genreCurators = await music.api.appleCurators(Object.values(genres) as any[]);

    genreCurators.map(genre => {
      const updatedGenre = genre;
      updatedGenre.attributes.name = updatedGenre.attributes.name.replace(translate.appleMusic, '');
      return updatedGenre;
    });

    this.setState({
      genreCurators,
    });
  };

  public render() {
    const { genreCurators } = this.state;

    return genreCurators ? (
      <div className={classes.searchGrid}>
        {genreCurators.map((genre: any) => (
          <GenreItem key={genre.id} curator={genre} size={120} />
        ))}
      </div>
    ) : (
      <Loader />
    );
  }
}

export default withRouter(Genres);
