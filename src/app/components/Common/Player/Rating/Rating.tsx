import cx from 'classnames';
import React from 'react';
import { getRating, setRating } from '../../../../services/MusicApi';
import styles from '../Player.scss';

interface RatingProps {
  nowPlayingItem: MusicKit.MediaItem;
}

interface RatingState {
  rating: number;
  loading: boolean;
}

class Rating extends React.Component<RatingProps, RatingState> {
  constructor(props: RatingProps) {
    super(props);

    this.state = {
      rating: 0,
      loading: true,
    };
  }

  public componentDidMount() {
    this.fetchRating();
  }

  public fetchRating = async () => {
    const rating = await getRating('song', this.props.nowPlayingItem.id);
    this.setState({
      rating,
      loading: false,
    });
  };

  public toggleRating = async () => {
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

  public render() {
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

export default Rating;
