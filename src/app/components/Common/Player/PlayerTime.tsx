import React, { useState } from 'react';
import useMK from '../../../hooks/useMK';
import { seekToTime } from '../../../services/MusicPlayerApi';
import { getTime } from '../../../utils/Utils';
import styles from './Player.scss';

interface PlayerTimeProps {
  nowPlayingItem: any;
}

function PlayerTime(props: PlayerTimeProps) {
  const mk = useMK({
    playbackTime: MusicKit.Events.playbackTimeDidChange,
    mediaItem: MusicKit.Events.mediaItemDidChange,
  });

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubbingPosition, setScrubbingPosition] = useState<number | null>(0);

  function timeToPercent(time: number, duration: number) {
    if (duration === 0) {
      return 0; // For some reason would call this
    }

    return Math.floor((time * 100) / duration);
  }

  function getCurrentPlaybackDuration() {
    return getTime(mk.instance.player.currentPlaybackTimeRemaining * 1000);
  }

  function getCurrentPlaybackTime() {
    return getTime(mk.instance.player.currentPlaybackTime * 1000);
  }

  function getCurrentBufferedProgress() {
    // Missing property currentBufferedProgress
    return (mk.instance.player as any).currentBufferedProgress;
  }

  function getDuration() {
    const { nowPlayingItem } = props;

    if (!nowPlayingItem) {
      return 0;
    }

    return mk.instance.isAuthorized ? nowPlayingItem.playbackDuration / 1000 : 30;
  }

  function getPositionValue(e: React.SyntheticEvent<HTMLInputElement>) {
    return ((e.target as HTMLInputElement).value as unknown) as number;
  }

  function onScrub(e: React.SyntheticEvent<HTMLInputElement>) {
    setScrubbingPosition(getPositionValue(e));
  }

  function onStartScrubbing(e: React.SyntheticEvent<HTMLInputElement>) {
    setIsScrubbing(true);
    setScrubbingPosition(getPositionValue(e));
  }

  async function onEndScrubbing(e: React.SyntheticEvent<HTMLInputElement>) {
    await seekToTime(getPositionValue(e));

    setIsScrubbing(false);
    setScrubbingPosition(null);
  }

  function getScrubberValue() {
    if (isScrubbing) {
      return scrubbingPosition;
    }

    if (mk.playbackTime) {
      return mk.playbackTime.currentPlaybackTime;
    }

    return 0;
  }

  function renderProgress() {
    const { playbackTime } = mk;

    const duration = getDuration();
    const percent = playbackTime ? timeToPercent(playbackTime.currentPlaybackTime, duration) : 0;
    const bufferPercent = playbackTime ? getCurrentBufferedProgress() : 0;

    return (
      <input
        className={styles.progressBar}
        style={{
          background: `linear-gradient(
              to right,
              #fe2851 0%,
              #fe2851 ${percent}%,
              #cccccc ${percent}%,
              #cccccc ${bufferPercent}%,
              #eeeeee ${bufferPercent}%,
              #eeeeee 100%
            ) no-repeat`,
        }}
        type={'range'}
        value={getScrubberValue()}
        onChange={onScrub}
        onMouseDown={onStartScrubbing}
        onTouchStart={onStartScrubbing}
        onMouseUp={onEndScrubbing}
        onTouchEnd={onEndScrubbing}
        min={0}
        max={duration}
        step={1}
      />
    );
  }

  return (
    <div className={styles.progressBarWrapper}>
      <span className={styles.playbackTime}>{getCurrentPlaybackTime()}</span>
      {renderProgress()}
      <span className={styles.playbackDuration}>{getCurrentPlaybackDuration()}</span>
    </div>
  );
}

export default PlayerTime;
