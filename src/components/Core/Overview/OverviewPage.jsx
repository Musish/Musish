import React from 'react';
import {withRouter} from 'react-router-dom';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import classes from "./OverviewPage.scss";
import Loader from "../../common/Loader";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
  }

  render() {
    return (
      <PageContent>
        <PageTitle
          title={"Overview"}
          context={"My Library"}
        />
        <p>Browse your Musi.sh library...</p>
        <div className={classes.flexGrid}>
          <div>
            abc
          </div>
          <div>
            <Loader/>
          </div>
        </div>
      </PageContent>
    );
  }
}

export default withRouter(OverviewPage);
