import React, { useState } from 'react';
import classes from './Settings.scss';
import useMK from '../../../../hooks/useMK';

export default function Settings() {
  const mk = useMK({
    [MusicKit.Events.playbackBitrateDidChange]: 'playbackBitrate',
  });
  const [bitrate, setBitrate] = useState(mk.instance.bitrate);

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
                  mk.instance.bitrate = MusicKit.PlaybackBitrate.HIGH;
                  setBitrate(mk.instance.bitrate);
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
                  mk.instance.bitrate = MusicKit.PlaybackBitrate.STANDARD;
                  setBitrate(mk.instance.bitrate);
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
