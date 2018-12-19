import React from 'react';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import classes from "./OverviewPage.scss";
import Loader from "../../common/Loader";
import AlbumItem from "../Albums/AlbumItem";
import {withRouter} from "react-router-dom";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frequentlyPlayed: null,
      recentlyPlayed: null,
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    // let frequentlyPlayed = music.api.historyHeavyRotation();
    let recentlyPlayed = music.api.recentPlayed();

    // frequentlyPlayed = await frequentlyPlayed;
    recentlyPlayed = await recentlyPlayed;

    this.setState({
      // frequentlyPlayed,
      recentlyPlayed
    })
  }

  render() {
    const {frequentlyPlayed, recentlyPlayed} = this.state;

    if (!recentlyPlayed) {
      return null;
    }

    console.log(recentlyPlayed);

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle
          title={"Overview"}
          context={"My Library"}
        />
        <h3>Frequently played</h3>
        <Loader/>
        <h3>Recently played</h3>
        <h4 className={classes.albumHeading}>Albums</h4>
        <div className={classes.flexGrid}>
          {
            recentlyPlayed ?
              recentlyPlayed.map((item, i) => {
                switch (item.type) {
                  case 'playlists':
                    break;
                  case 'albums':
                    return (
                      <AlbumItem key={i} album={item} size={120}/>
                    );
                  default:
                    return null
                }
              }) : <Loader/>
          }
        </div>
        <h4 className={classes.playlistHeading}>Playlists</h4>
        <div className={classes.flexGrid}>
          {
            recentlyPlayed ?
              recentlyPlayed.map((item, i) => {
                switch (item.type) {
                  case 'playlists':
                    return (
                      <AlbumItem key={i} album={item} size={120}/>
                    );
                  case 'albums':
                    break;
                  default:
                    return null
                }
              }) : <Loader/>
          }
        </div>
      </PageContent>
    );
  }
}

export default withRouter(OverviewPage);
