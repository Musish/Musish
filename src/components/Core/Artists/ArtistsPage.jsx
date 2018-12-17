import React from 'react';
import {Link, Route} from "react-router-dom";
import cx from 'classnames';


import PageTitle from "../../common/PageTitle";
import InfiniteScroll from '../common/InfiniteScroll';
import Loader from "../../common/Loader";
import classes from './Artists.scss';
import PageContent from "../Layout/PageContent";
import AlbumPanel from "../Albums/AlbumPanel";

export default class ArtistsPage extends React.Component {
  render() {
    return (
      <>
        <ArtistList/>
        <Route path={'/artists/:id'} exact render={({match: {params: {id}}}) => (
          <ArtistAlbums key={id} id={id}/>
        )}/>
      </>
    );
  }
}

class ArtistList extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.rowRenderer = this.rowRenderer.bind(this);
  }

  async load(params) {
    const music = MusicKit.getInstance();
    return await music.api.library.artists(null, params);
  }

  rowRenderer({item: artist, index, isScrolling, isVisible, key, style}) {
    const path = `/artists/${artist.id}`;
    return (
      <li key={key} style={style}>
        <Route path={path} exact children={({match}) => (
          <Link to={path} className={cx(classes.artist, (!!match ? classes.activeArtist : null))}>
            <div className={classes.artistBacker} />
            <div>
              <span className={classes.pictureWrapper} />
            </div>
            <div>
              <span className={classes.artistName}>
                {artist.attributes.name}
              </span>
            </div>
          </Link>
        )}/>
      </li>
    )
  }

  render() {
    return (
      <aside className={classes.artistList} ref={this.ref}>
        <ul>
          <InfiniteScroll scrollElement={this.ref} rowHeight={60} load={this.load} rowRenderer={this.rowRenderer}/>
        </ul>
      </aside>
    );
  }
}

class ArtistAlbums extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const artist = await music.api.library.artist(this.props.id, {include: 'albums'});

    console.log(artist);

    this.setState({
      artist,
    });
  }

  renderArtists() {
    const {artist} = this.state;

    return artist.relationships.albums.data.map((album, i) => {
      return (
        <AlbumPanel key={i} album={album}/>
      );
    })
  }

  renderContent() {
    const {artist} = this.state;

    if (!artist) {
      return <Loader/>;
    }

    return (
      <>
        <PageTitle title={artist.attributes.name} context={"My Library"}/>
        {this.renderArtists()}
      </>
    )
  }

  render() {


    return (
      <PageContent>
        {this.renderContent()}
      </PageContent>
    );
  }
}
