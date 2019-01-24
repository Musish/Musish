import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import withMK from '../../../hoc/withMK';
import styles from './Player.scss';
import { volumeUp, volumeDown } from '../../../services/MusicPlayerApi';

class VolumeControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: props.mk.instance.player.volume,
    };

    this.getVolumeIconClasses = this.getVolumeIconClasses.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
  }

  componentDidMount() {
    // Volume controls (VOLUME UP)
    Mousetrap.bind(
      'up',
      e => {
        e.preventDefault();
        this.setState({
          volume: volumeUp(),
        });
      },
      'keydown'
    );

    // Volume controls (VOLUME DOWN)
    Mousetrap.bind(
      'down',
      e => {
        e.preventDefault();
        this.setState({
          volume: volumeDown(),
        });
      },
      'keydown'
    );
  }

  getVolumeIconClasses() {
    const { volume } = this.state;

    if (volume === 0) {
      return 'fas fa-times';
    }

    if (volume < 0.3) {
      return 'fas fa-volume-off';
    }

    if (volume < 0.6) {
      return 'fas fa-volume-down';
    }

    return 'fas fa-volume-up';
  }

  handleVolumeChange(e) {
    this.props.mk.instance.player.volume = e.target.value;
    this.setState({
      volume: e.target.value,
    });
  }

  toggleVolume() {
    const { player } = this.props.mk.instance;
    player.volume = player.volume === 0 ? this.state.volume : 0;
  }

  render() {
    const { mk } = this.props;

    return (
      <span className={cx(styles.controls, styles.volumeControlWrapper)}>
        <i className={this.getVolumeIconClasses()} onClick={this.toggleVolume} />
        <div className={styles.volumeControlContainer}>
          <div className={styles.volumeBarWrapper}>
            <input
              className={cx(styles['progress-bar'], styles.volumeBar)}
              style={{
                background: `linear-gradient(
              to right,
              #fe2851 0%,
              #fe2851 ${mk.instance.player.volume * 100}%,
              #cccccc ${mk.instance.player.volume * 100}%,
              #cccccc 100%
            ) no-repeat`,
              }}
              type={'range'}
              value={mk.instance.player.volume}
              onChange={this.handleVolumeChange}
              onClick={this.handleVolumeChange}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
        </div>
      </span>
    );
  }
}

const bindings = {
  [MusicKit.Events.playbackVolumeDidChange]: 'playbackVolume',
};

VolumeControl.propTypes = {
  mk: PropTypes.any.isRequired,
};

export default withMK(VolumeControl, bindings);
