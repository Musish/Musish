import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from './BrowsePage.scss';
import PlaylistItem from '../../../../Common/PlaylistItem/PlaylistItem';
import AlbumItem from '../../../../Common/AlbumItem/AlbumItem';
import Loader from '../../../../Common/Loader/Loader';
import CuratorItem from '../../../../Common/CuratorItem/CuratorItem';

class ItemList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
    };

    this.fetchItems = this.fetchItems.bind(this);
  }

  async fetchItems(ids) {
    const music = MusicKit.getInstance();
    let items;

    switch (this.props.type) {
      case 'playlist':
        items = await music.api.playlists(ids);
        break;
      case 'album':
        items = await music.api.albums(ids);
        break;
      case 'curator':
        items = await music.api.curators(ids);
        break;
      case 'apple-curator':
        items = await music.api.appleCurators(ids);
        break;
      default:
        return;
    }

    this.setState({
      list: items,
    });
  }

  async componentDidMount() {
    const { list, listIds } = this.props;
    if (!list && listIds) {
      this.fetchItems(this.props.listIds);
    }
  }

  render() {
    const list = this.props.list ? this.props.list : this.state.list;
    const { type, rows, size } = this.props;

    const styles = {
      gridTemplateRows: 'auto '.repeat(rows),
    };

    return (
      <>
        <h3>{this.props.title}</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid)} style={styles}>
            {list ? (
              list.map(item => {
                switch (type) {
                  case 'playlist':
                    return <PlaylistItem key={item.id} playlist={item} size={size} />;
                  case 'album':
                    return <AlbumItem key={item.id} album={item} size={size} />;
                  case 'curator':
                  case 'apple-curator':
                    return <CuratorItem key={item.id} curator={item} size={size} />;
                  default:
                    return null;
                }
              })
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </>
    );
  }
}

ItemList.propTypes = {
  title: PropTypes.any.isRequired,
  type: PropTypes.any.isRequired,
  list: PropTypes.any,
  listIds: PropTypes.any,
  rows: PropTypes.number,
  size: PropTypes.number,
};

ItemList.defaultProps = {
  list: null,
  listIds: null,
  rows: 1,
  size: 170,
};

export default withRouter(ItemList);
