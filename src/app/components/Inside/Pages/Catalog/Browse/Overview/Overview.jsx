import React from 'react';
import { withRouter } from 'react-router-dom';
import Loader from '../../../../../Common/Loader/Loader';
import * as MusicPlayerApi from '../../../../../../services/MusicPlayerApi';
import * as Backend from '../../../../../../services/Backend';
import BrowseSection from './BrowseSection';
import iTunesFactory from '../../../../../../utils/iTunesFactory/iTunesFactory';

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: null,
    };

    this.ref = React.createRef();
    this.getOverview = this.getOverview.bind(this);
  }

  componentDidMount() {
    this.getOverview();
  }

  async getOverview() {
    const pageData = await Backend.getBrowseOverview(MusicKit.getInstance().api.storefrontId);
    // const data = await StorePageParser.normalisePageData(pageData);

    const newData = await iTunesFactory(pageData).render();

    console.log(newData);

    this.setState({
      sections: newData, // TODO: data.content,
    });
  }

  static playTrack({ tracks, index }) {
    MusicPlayerApi.playTrack(tracks, index);
  }

  render() {
    const { sections } = this.state;

    if (!sections) {
      return <Loader />;
    }

    return sections.map(section => <BrowseSection section={section} />);
  }
}

export default withRouter(Overview);
