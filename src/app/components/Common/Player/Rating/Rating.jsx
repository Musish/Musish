import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getRating, setRating } from '../../../../services/MusicApi';
import styles from '../Player.scss';
import translate from '../../../../utils/translations/Translations';

class Rating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 0,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchRating();
  }

  fetchRating = async () => {
    const rating = await getRating('song', this.props.nowPlayingItem.id);
    this.setState({
      rating,
      loading: false,
    });
  };

  toggleRating = async () => {
    this.setState({
      loading: true,
    });

    const { rating: currentRating } = this.state;

    const newRating = currentRating === 1 ? -1 : currentRating + 1;
    const rating = await setRating('song', this.props.nowPlayingItem.id, newRating);

    this.setState({
      rating,
      loading: false,
    });

    return rating;
  };

  render() {
    let heartClass = 'fas fa-heart';
    let title = translate.playerAddToFavorite;
    if (this.state.rating === -1) {
      heartClass = 'fas fa-heart-broken';
      title = translate.playerRemoveDislike;
    } else if (this.state.rating === 1) {
      title = translate.playerDislike;
    }

    return (
      <span
        className={cx(styles.controls, { [styles.enabled]: this.state.rating !== 0 })}
        onClick={!this.state.loading ? this.toggleRating : undefined}
        title={title}
      >
        <i className={heartClass} />
      </span>
    );
  }
}

Rating.propTypes = {
  nowPlayingItem: PropTypes.any.isRequired,
};

export default Rating;
