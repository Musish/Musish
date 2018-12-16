import React from 'react';
import {withRouter} from 'react-router-dom';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import classes from "./BrowsePage.scss";
import Loader from "../../common/Loader";

class BrowsePage extends React.Component {
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
    let frequentlyPlayed = music.api.historyHeavyRotation();
    let recentlyPlayed = music.api.recentPlayed();

    frequentlyPlayed = await frequentlyPlayed;
    recentlyPlayed = await recentlyPlayed;

    this.setState({
      frequentlyPlayed,
      recentlyPlayed
    })
  }

  render() {
    const {frequentlyPlayed, recentlyPlayed} = this.state;
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle
          title={"Browse"}
          context={"Apple Music"}
        />
        <h3>Frequently played</h3>
        <Loader/>
      </PageContent>
    );
  }
}

export default withRouter(BrowsePage);
