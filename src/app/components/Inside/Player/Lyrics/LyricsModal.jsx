import cx from 'classnames';
import React from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import queueClasses from '../Queue/Queue.scss';
import classes from './LyricsModal.scss';
import Lyrics from './Lyrics';
import LyricsModalContext from './LyricsModalContext';
import withContext from '../../../../hoc/withContext';
import withMK from '../../../../hoc/withMK';
import { getPlayingItem } from '../../../../services/MusicPlayerApi';
import translate from '../../../../utils/translations/Translations';

function LyricsModal({ opened, close, mk }) {
  if (!opened) {
    return null;
  }

  const nowPlaying = getPlayingItem();

  return (
    <Draggable handle={'.handle'} defaultPosition={{ x: 0, y: 0 }} position={null}>
      <div className={cx(queueClasses.modal, classes.modal)} onClick={e => e.stopPropagation()}>
        <div className={cx(queueClasses.header, 'handle')}>
          <div className={queueClasses.title}>
            <span>
              <i className="fas fa-grip-vertical" />
              {` ${translate.lyrics}`}
            </span>
          </div>
          <div className={queueClasses.icons} onClick={close}>
            <span>
              <i className="fas fa-times" />
            </span>
          </div>
        </div>
        {nowPlaying ? <Lyrics key={nowPlaying.id} song={nowPlaying} /> : '...'}
      </div>
    </Draggable>
  );
}

LyricsModal.propTypes = {
  opened: PropTypes.bool,
  close: PropTypes.func,
  mk: PropTypes.any.isRequired,
};

LyricsModal.defaultProps = {
  opened: null,
  close: null,
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
};

export default withMK(withContext(LyricsModal, LyricsModalContext), bindings);
