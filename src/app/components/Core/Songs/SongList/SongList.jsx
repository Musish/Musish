import React from 'react';

import { connectMenu, ContextMenu, MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import classes from './SongList.scss';
import InfiniteScroll from '../../common/InfiniteScroll';
import SongListItem from './SongListItem';

export const MENU_TYPE = 'DYNAMIC';

function DynamicMenu({ id, trigger }) {
  if (!trigger) {
    return null;
  }

  const {
    song: { attributes },
  } = trigger.song;
  const inLibrary = attributes.playParams.isLibrary;

  return (
    <ContextMenu id={id}>
      <div className={'item-info'}>
        <div className={'artwork'}>
          <div className={'artwork-wrapper'}>
            <img src={trigger.artworkURL} alt={attributes.name} />
          </div>
        </div>
        <div className={'description'}>
          <h1>{attributes.name}</h1>
          <h2>{attributes.artistName}</h2>
          <h3>{attributes.albumName}</h3>
        </div>
      </div>

      <MenuItem divider />

      <MenuItem onClick={trigger.playSong}>Play</MenuItem>
      <MenuItem onClick={trigger.queueNext}>Play next</MenuItem>
      <MenuItem onClick={trigger.queueLater}>Play later</MenuItem>

      <MenuItem divider />

      <MenuItem onClick={trigger.queueLater}>Show Artist</MenuItem>
      <MenuItem onClick={trigger.queueLater}>Show Album</MenuItem>
      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={trigger.queueLater}>Add to library</MenuItem>
        </>
      )}
    </ContextMenu>
  );
}

DynamicMenu.propTypes = {
  id: PropTypes.string.isRequired,
  trigger: PropTypes.any,
};

DynamicMenu.defaultProps = {
  trigger: null,
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

export default class SongList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: null,
    };

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onSetItems = this.onSetItems.bind(this);
  }

  onSetItems(state) {
    this.setState({
      songs: state.items,
    });

    this.props.onSetItems(state);
  }

  rowRenderer({ item: song, index, isScrolling, isVisible, key, style }) {
    const { songs } = this.state;
    const { showArtist, showAlbum } = this.props;

    return (
      <SongListItem
        key={key}
        song={song}
        index={index}
        songs={songs}
        showArtist={showArtist}
        showAlbum={showAlbum}
        style={style}
      />
    );
  }

  render() {
    const { showArtist, showAlbum, scrollElement, load } = this.props;

    return (
      <div className={classes.songList}>
        <InfiniteScroll
          onSetItems={this.onSetItems}
          scrollElement={scrollElement}
          load={load}
          rowHeight={showAlbum || showArtist ? 50 : 37}
          rowRenderer={this.rowRenderer}
        />
        <ConnectedMenu />
      </div>
    );
  }
}

SongList.propTypes = {
  showArtist: PropTypes.bool,
  showAlbum: PropTypes.bool,
  scrollElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  load: PropTypes.func.isRequired,
  onSetItems: PropTypes.func,
};

SongList.defaultProps = {
  showArtist: false,
  showAlbum: false,
  scrollElement: null,
  onSetItems: () => null,
};
