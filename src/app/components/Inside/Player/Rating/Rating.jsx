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
    };
    this.toggleRating = this.toggleRating.bind(this);
  }

  async componentDidMount() {
    const rating = await getRating('song', this.props.nowPlayingItem.id);
    this.setState({
      rating,
    });
  }

  toggleRating() {
    if (this.state.rating === 1) {
      setRating('song', this.props.nowPlayingItem.id, -1).then(result =>
        this.setState({
          rating: result,
        })
      );
    } else {
      setRating('song', this.props.nowPlayingItem.id, this.state.rating + 1).then(result =>
        this.setState({
          rating: result,
        })
      );
    }
  }

  render() {
    let heartClass = 'far fa-heart';
    if (this.state.rating === 1) {
      heartClass = 'fas fa-heart';
    } else if (this.state.rating === -1) {
      heartClass = 'fas fa-heart-broken';
    }

    return (
      <span
        className={cx(styles.controls, { [styles.enabled]: this.state.rating !== 0 })}
        onClick={this.toggleRating}
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
