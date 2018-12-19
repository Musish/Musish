import React from 'react';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import SongList from "../common/SongList/SongList";
import Modal from "../../common/Modal/Modal";
import Queue from "../Player/Queue/Queue";

export default class SongsPage extends React.Component {
  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.songs(null, params);
  }

  render() {
    return (
      <PageContent innerRef={this.scrollRef}>
        <PageTitle title={"Songs"} context={"My Library"}/>

        <SongList
          load={this.load}
          scrollElement={this.scrollRef}
          album={false}
          showAlbum={true}
          showArtist={true}
        />
      </PageContent>
    );
  }
}
