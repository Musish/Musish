import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from './BrowsePage.scss';
import PlaylistItem from '../Playlists/PlaylistItem';
import AlbumItem from '../Albums/AlbumItem';
import Loader from '../../common/Loader';

class ItemList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
    };

    this.getItems = this.getItems.bind(this);
  }

  async getItems(ids) {
    const music = MusicKit.getInstance();
    const list =
      this.props.type === 'playlist' ?
      await music.api.playlists(ids) : await music.api.albums(ids);

    this.setState({
      list,
    });
  }

  async componentDidMount() {
    const { list, listIds } = this.props;
    if (!list && listIds) {
      this.getItems(this.props.listIds);
    }
  }

  render() {
    const list = this.props.list ? this.props.list : this.state.list;

    return (
      <>
        <h3>{this.props.title}</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid)}>
            {list ? (
              list.map(item => {
                if (this.props.type === 'playlist') {
                  return <PlaylistItem key={item.id} playlist={item} size={170} />;
                } else if (this.props.type === 'album') {
                  return <AlbumItem key={item.id} album={item} size={170} />;
                }
                return '';
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
  title: PropTypes.any,
  type: PropTypes.any,
  list: PropTypes.any,
  listIds: PropTypes.any,
};

ItemList.defaultProps = {
  title: '',
  type: 'playlist',
  list: null,
  listIds: null,
};

export default withRouter(ItemList);
