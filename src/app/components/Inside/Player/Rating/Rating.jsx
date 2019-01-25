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
    this.getRating = this.getRating.bind(this);
  }

  componentDidMount() {
    this.getRating();
  }

  async getRating() {
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

    if (this.state.rating === 1) {
      return setRating('song', this.props.nowPlayingItem.id, -1).then(result =>
        this.setState({
          rating: result,
          loading: false,
        })
      );
    }
    return setRating('song', this.props.nowPlayingItem.id, this.state.rating + 1).then(result =>
      this.setState({
        rating: result,
        loading: false,
      })
    );
  }

  render() {
    let heartClass = 'fas fa-heart';
    if (this.state.rating === -1) {
      heartClass = 'fas fa-heart-broken';
    }

    return (
      <span
        className={cx(styles.controls, { [styles.enabled]: this.state.rating !== 0 })}
        onClick={this.state.loading ? e => '' : this.toggleRating}
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
