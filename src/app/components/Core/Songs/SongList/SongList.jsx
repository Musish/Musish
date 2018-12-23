import React from 'react';

import { connectMenu, ContextMenu, MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import classes from './SongList.scss';
import InfiniteScroll from '../../common/InfiniteScroll';
import SongListItem from './SongListItem';

export const MENU_TYPE = 'DYNAMIC';

function DynamicMenu({ trigger }) {
  return <ContextMenu id={MENU_TYPE}>{trigger && trigger.render}</ContextMenu>;
}

DynamicMenu.propTypes = {
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
