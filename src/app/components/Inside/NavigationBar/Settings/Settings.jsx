import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './Settings.scss';
import withMK from '../../../../hoc/withMK';

function Settings(props) {
  const [bitrate, setBitrate] = useState(props.mk.instance.bitrate);
  return (
    <span className={classes.settingsWrapper}>
      <i className="fas fa-cog" />
      <div className={classes.settingsControlWrapper}>
        <div className={classes.bitrateToggleWrapper}>
          <h5>Playback quality</h5>
          <span className={classes.radioWrapper}>
            <label htmlFor="high-bitrate">
              <input
                id="high-bitrate"
                type="radio"
                name="bitrate"
                value={MusicKit.PlaybackBitrate.HIGH}
                checked={bitrate === MusicKit.PlaybackBitrate.HIGH}
                onChange={() => {
                  MusicKit.getInstance().bitrate = MusicKit.PlaybackBitrate.HIGH;
                  setBitrate(props.mk.instance.bitrate);
                }}
              />
              High (256kbps)
            </label>
          </span>
          <span className={classes.radioWrapper}>
            <label htmlFor="standard-bitrate">
              <input
                id="standard-bitrate"
                type="radio"
                name="bitrate"
                value={MusicKit.PlaybackBitrate.STANDARD}
                checked={bitrate === MusicKit.PlaybackBitrate.STANDARD}
                onChange={() => {
                  MusicKit.getInstance().bitrate = MusicKit.PlaybackBitrate.STANDARD;
                  setBitrate(props.mk.instance.bitrate);
                }}
              />
              Standard (64kbps)
            </label>
          </span>
        </div>
      </div>
    </span>
  );
}

Settings.propTypes = {
  mk: PropTypes.any.isRequired,
};

const bindings = {
  [MusicKit.Events.playbackBitrateDidChange]: 'playbackBitrate',
};

export default withMK(Settings, bindings);
