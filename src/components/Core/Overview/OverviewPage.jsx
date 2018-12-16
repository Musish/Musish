import React from 'react';
import {withRouter} from 'react-router-dom';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import classes from "./OverviewPage.scss";
import Loader from "../../common/Loader";

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
    console.log(recentlyPlayed);
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle
          title={"Overview"}
          context={"My Library"}
        />
        <div className={classes.flexGrid}>
          <div>
            <h3>Frequently played</h3>
            <Loader/>
          </div>
          <div>
            <h3>Recently played</h3>
            <Loader/>
          </div>
        </div>
      </PageContent>
    );
  }
}

export default withRouter(OverviewPage);
