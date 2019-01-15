import React from 'react';
import { withRouter } from 'react-router-dom';
import PageContent from '../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import * as MusicPlayerApi from '../../../../../services/MusicPlayerApi';
import Tabs from '../../../../Common/Tabs/Tabs';
import Tab from '../../../../Common/Tabs/Tab';
import TopCharts from './TopCharts/TopCharts';
import Playlists from './Playlists/Playlists';

class BrowsePage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  static playTrack({ tracks, index }) {
    MusicPlayerApi.playTrack(tracks, index);
  }

  render() {
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Browse'} context={'Apple Music'} />

        <Tabs>
          <Tab name={'Top Charts'} route={'/browse'}>
            <TopCharts />
          </Tab>
          <Tab name={'Playlists'} route={'/browse/playlists'}>
            <Playlists />
          </Tab>
        </Tabs>
      </PageContent>
    );
  }
}

export default withRouter(BrowsePage);
