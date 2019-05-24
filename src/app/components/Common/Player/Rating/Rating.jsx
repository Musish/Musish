import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getRating, setRating } from '../../../../services/MusicApi';
import styles from '../Player.scss';

class Rating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 0,
      loading: true,
    };

    this.toggleRating = this.toggleRating.bind(this);
    this.fetchRating = this.fetchRating.bind(this);
  }

  componentDidMount() {
    this.fetchRating();
  }

  async fetchRating() {
    const rating = await getRating('song', this.props.nowPlayingItem.id);
    this.setState({
      rating,
      loading: false,
    });
  }

  async toggleRating() {
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
  }

  render() {
    let heartClass = 'fas fa-heart';
    if (this.state.rating === -1) {
      heartClass = 'fas fa-heart-broken';
    }

    return (
      <span
        className={cx(styles.controls, { [styles.enabled]: this.state.rating !== 0 })}
        onClick={!this.state.loading ? this.toggleRating : undefined}
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
