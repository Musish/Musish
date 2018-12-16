import React from 'react';
import PageTitle from "../../common/PageTitle";
import InfiniteScroll from '../common/InfiniteScroll';
import Loader from "../../common/Loader";

import Classes from './Artists.scss';
import PageContent from "../Layout/PageContent";
import AlbumPanel from "../Albums/AlbumPanel";
import {Link, Route} from "react-router-dom";

export default class ArtistsPage extends React.Component {
  render() {
    return (
      <>
        <ArtistList/>
        <PageContent>
          <Route path={'/artists/:id'} exact render={({match: {params: {id}}}) => (
            <ArtistAlbums key={id} id={id}/>
          )}/>
        </PageContent>
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
    return (
      <Link key={key} to={`/artists/${artist.id}`}>
        <li style={style}>
          <div>
            <span className={Classes.pictureWrapper}>

            </span>
          </div>
          <div>
            <span className={Classes.artistName}>
              {artist.attributes.name}
            </span>
          </div>
        </li>
      </Link>
    )
  }

  render() {
    return (
      <aside className={Classes.artistList} ref={this.ref}>
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

  render() {
    const {artist} = this.state;

    if (!artist) {
      return <Loader/>;
    }

    return (
      <PageContent>
        <PageTitle title={artist.attributes.name} context={"My Library"}/>
        {this.renderArtists()}
      </PageContent>
    );
  }
}
