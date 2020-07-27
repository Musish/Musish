import cx from 'classnames';
import React from 'react';
import Draggable from 'react-draggable';
import useMK from '../../../../hooks/useMK';
import { getPlayingItem } from '../../../../services/MusicPlayerApi';
import translate from '../../../../utils/translations/Translations';
import { useLyricsModal } from '../../../Providers/LyricsModalProvider';
import queueClasses from '../Queue/Queue.scss';
import Lyrics from './Lyrics';
import classes from './LyricsModal.scss';

function LyricsModal() {
  useMK({
    mediaItem: MusicKit.Events.mediaItemDidChange,
  });

  const lyricsContext = useLyricsModal();

  if (!lyricsContext.isOpen) {
    return null;
  }

  const nowPlaying = getPlayingItem();

  return (
    <Draggable handle={'.lyricsHandle'} defaultPosition={{ x: 0, y: 0 }}>
      <div className={cx(queueClasses.modal, classes.modal)} onClick={e => e.stopPropagation()}>
        <div className={cx(queueClasses.header, 'lyricsHandle')}>
          <div className={queueClasses.title}>
            <span>
              <i className='fas fa-grip-vertical' />
              {` ${translate.lyrics}`}
            </span>
          </div>
          <div className={queueClasses.icons} onClick={lyricsContext.close}>
            <span>
              <i className='fas fa-times' />
            </span>
          </div>
        </div>
        {nowPlaying ? <Lyrics key={nowPlaying.id} song={nowPlaying} /> : '...'}
      </div>
    </Draggable>
  );
}

export default LyricsModal;
