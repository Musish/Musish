import React from 'react';
import {withRouter} from 'react-router-dom';
import Loader from "../../common/Loader";
import InfiniteScroll from "../common/InfiniteScroll";
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import SongList from "../common/SongList/SongList";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
  }

  render() {
    return (
      <div>
        abc
      </div>
    );
  }
}

export default withRouter(OverviewPage);
