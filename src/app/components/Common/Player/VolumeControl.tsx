import cx from 'classnames';
import Mousetrap from 'mousetrap';
import React, { SyntheticEvent } from 'react';
import withMK from '../../../hoc/withMK';
import styles from './Player.scss';

type VolumeControlProps = MKProps;

interface VolumeControlState {
  volume: any;
}

class VolumeControl extends React.Component<VolumeControlProps, VolumeControlState> {
  constructor(props: VolumeControlProps) {
    super(props);

    this.state = {
      volume: props.mk.instance.player.volume,
    };
  }

  public componentDidMount() {
    // Volume controls (VOLUME UP)
    Mousetrap.bind(
      'up',
      e => {
        e.preventDefault();
        const { player } = MusicKit.getInstance();
        const newVolume = player.volume < 0.9 ? player.volume + 0.1 : 1;
        this.changeVolume(newVolume);
      },
      'keydown',
    );

    // Volume controls (VOLUME DOWN)
    Mousetrap.bind(
      'down',
      e => {
        e.preventDefault();
        const { player } = MusicKit.getInstance();
        const newVolume = player.volume > 0.1 ? player.volume - 0.1 : 0;
        this.changeVolume(newVolume);
      },
      'keydown',
    );
  }

  public getVolumeIconClasses = () => {
    const { volume } = this.props.mk.instance.player;

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
  };

  public handleVolumeBarChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.changeVolume(parseFloat((e.target as HTMLInputElement).value));
  };

  public changeVolume = (volume: any, updateState = true) => {
    this.props.mk.instance.player.volume = volume;

    if (updateState) {
      this.setState({
        volume,
      });
    }
  };

  public toggleVolume = () => {
    const { player } = this.props.mk.instance;
    const previousVolume = this.state.volume;
    const isMuted = player.volume === 0;

    if (isMuted && previousVolume === 0) {
      this.changeVolume(0.25);
      return;
    }

    const newVolume = isMuted ? previousVolume : 0;
    this.changeVolume(newVolume, false);
  };

  public render() {
    const { mk } = this.props;

    return (
      <span className={cx(styles.controls, styles.volumeControlWrapper)}>
        <i className={this.getVolumeIconClasses()} onClick={this.toggleVolume} />
        <div className={styles.volumeControlContainer}>
          <div className={styles.volumeBarWrapper}>
            <input
              className={cx(styles.progressBar, styles.volumeBar)}
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
              onChange={this.handleVolumeBarChange}
              onClick={this.handleVolumeBarChange}
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

export default withMK(VolumeControl, bindings);
