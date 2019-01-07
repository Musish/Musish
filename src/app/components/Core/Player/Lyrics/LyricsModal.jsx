import cx from 'classnames';
import React from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import queueClasses from '../Queue/Queue.scss';
import classes from './LyricsModal.scss';
import Lyrics from './Lyrics';
import LyricsModalContext from './LyricsModalContext';
import withContext from '../../../../hoc/withContext';

function LyricsModal({ lyricsSong, close }) {
  if (!lyricsSong) {
    return null;
  }

  return (
    <Draggable handle={'.handle'} defaultPosition={{ x: 0, y: 0 }} position={null}>
      <div className={cx(queueClasses.modal, classes.modal)} onClick={e => e.stopPropagation()}>
        <div className={cx(queueClasses.header, 'handle')}>
          <div className={queueClasses.title}>
            <span>
              <i className="fas fa-grip-vertical" />
              {' Lyrics'}
            </span>
          </div>
          <div className={queueClasses.icons} onClick={close}>
            <span>
              <i className="fas fa-times" />
            </span>
          </div>
        </div>
        <Lyrics key={lyricsSong.id} song={lyricsSong} />
      </div>
    </Draggable>
  );
}

LyricsModal.propTypes = {
  lyricsSong: PropTypes.any,
  close: PropTypes.func,
};

LyricsModal.defaultProps = {
  lyricsSong: null,
  close: null,
};

export default withContext(LyricsModal, LyricsModalContext);
