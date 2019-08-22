import React, { useContext, useState } from 'react';
import useMK from '../../../../hooks/useMK';
import translate from '../../../../utils/translations/Translations';
import { LastfmContext } from '../../../Providers/LastfmProvider';
import classes from './Settings.scss';

export default function Settings() {
  const { login, reset, connected } = useContext(LastfmContext);

  const mk = useMK({
    playbackBitrate: MusicKit.Events.playbackBitrateDidChange,
  });
  const [bitrate, setBitrate] = useState(mk.instance.bitrate);

  return (
    <span className={classes.settingsWrapper}>
      <i className='fas fa-cog' />
      <div className={classes.settingsControlWrapper}>
        <div className={classes.section}>
          <h5>Last.fm</h5>
          {connected ? (
            <div className={classes.lastfmButton} onClick={reset}>
              {translate.lfmDisconnect}
            </div>
          ) : (
            <div className={classes.lastfmButton} onClick={login}>
              {translate.lfmConnect}
            </div>
          )}
        </div>
        <div className={classes.section}>
          <h5>Playback quality</h5>
          <span className={classes.radioWrapper}>
            <label htmlFor='high-bitrate'>
              <input
                id='high-bitrate'
                type='radio'
                name='bitrate'
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
            <label htmlFor='standard-bitrate'>
              <input
                id='standard-bitrate'
                type='radio'
                name='bitrate'
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
