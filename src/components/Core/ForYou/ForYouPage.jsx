import React from 'react';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import classes from "./ForYouPage.scss";
import Loader from "../../common/Loader";
import AlbumItem from "../Albums/AlbumItem";
import PlaylistItem from "../Playlists/PlaylistItem";
import {withRouter} from "react-router-dom";
import cx from 'classnames';

class ForYouPage extends React.Component {
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
    let heavyRotation = music.api.historyHeavyRotation();
    let recentlyPlayed = music.api.recentPlayed();
    let recommendations = music.api.recommendations();

    heavyRotation = await heavyRotation;
    recentlyPlayed = await recentlyPlayed;
    recommendations = await recommendations;

    this.setState({
      heavyRotation,
      recentlyPlayed,
      recommendations
    })
  }

  render() {
    const {heavyRotation, recentlyPlayed, recommendations} = this.state;

    if (!recentlyPlayed) {
      return null;
    }

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle
          title={"For You"}
          context={"Apple Music"}
        />
        <h3>Recently played</h3>
        <div className={cx(classes.scrollWrapper)}>
          <div className={classes.scrollGrid}>
            {recentlyPlayed ? (
              recentlyPlayed.map((item) => {
                switch (item.type) {
                  case 'playlists':
                    return (
                      <PlaylistItem key={item.id} playlist={item} size={120} />
                    );
                  case 'albums':
                    return (
                      <AlbumItem key={item.id} album={item} size={120} />
                    );
                  default:
                    return null
                }
              })
            ) : (
              <Loader />
            )}
          </div>
        </div>

        <h3>Heavy Rotation</h3>
        <div className={classes.scrollWrapper}>
          <div className={classes.scrollGrid}>
            {heavyRotation ? (
              heavyRotation.map((item) => {
                switch (item.type) {
                  case 'playlists':
                    return (
                      <PlaylistItem key={item.id} playlist={item} size={120} />
                    );
                  case 'albums':
                    return (
                      <AlbumItem key={item.id} album={item} size={120} />
                    );
                  default:
                    return null
                }
              })
            ) : (
              <Loader />
            )}
          </div>
        </div>

        {recommendations.map((recList) => {

          const items = recList.relationships.contents == undefined ? recList.relationships.recommendations : recList.relationships.contents;
          const isGroup = recList.attributes.isGroupRecommendation;
          return (
            <React.Fragment key={recList.id}>
              <h3>{recList.attributes.title.stringForDisplay}</h3>
              <div className={cx(classes.scrollWrapper)}>
                <div className={cx(classes.scrollWrapper, {[classes.groupedScroller]: isGroup})}>
                  <div className={classes.scrollGrid}>
                    {items.data.map((item, i) => {
                      switch (item.type) {
                        case 'playlists':
                          return (
                            <PlaylistItem key={item.id} playlist={item} size={120}/>
                          );
                        case 'albums':
                          return (
                            <AlbumItem key={item.id} album={item} size={120}/>
                          );
                        case 'personal-recommendation':
                          const recommendationName = item.attributes.reason.stringForDisplay;
                          return (
                            <div key={`${item.id}-${recommendationName}`} className={classes.recommendationGroup}>
                              <span className={classes.personalRecommendationsTitle}>{recommendationName}</span>
                              <div className={classes.personalRecommendationsGrid}>
                                {item.relationships.contents.data.map((subItem) => {
                                  const subId = `${item.id}-${subItem.id}`;
                                  switch (subItem.type) {
                                    case 'playlists':
                                      return (
                                        <PlaylistItem key={subId} playlist={subItem} size={100} />
                                      );
                                    case 'albums':
                                      return (
                                        <AlbumItem key={subId} album={subItem} size={100} />
                                      );
                                    default:
                                      return null
                                  }
                                })}
                              </div>
                            </div>
                          );
                        default:
                          return null
                      }
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </PageContent>
    );
  }
}

export default withRouter(ForYouPage);
