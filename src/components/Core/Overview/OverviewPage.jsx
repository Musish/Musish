import React from 'react';
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import classes from "./OverviewPage.scss";
import Loader from "../../common/Loader";
import AlbumItem from "../Albums/AlbumItem";
import PlaylistItem from "../Playlists/PlaylistItem";
import {withRouter} from "react-router-dom";
import cx from 'classnames';

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
    let heavyRotation = music.api.historyHeavyRotation();
    let recentlyPlayed = music.api.recentPlayed();
    let recommendations = music.api.recommendations();
    // ID 6: favourites, chill, new music mix
    // ID 2: this days playlists
    // ID 5: this days albums
    // ID 3: artist spotlight playlists
    // ID 9: new release albums
    // There doesnt seem to be an order for this - so it may be user specific?

    heavyRotation = await heavyRotation;
    recentlyPlayed = await recentlyPlayed;
    recommendations = await recommendations;
    console.log(recommendations);

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
        {recommendations.map((recList) => {
          
          const items = recList.relationships.contents == undefined ? recList.relationships.recommendations : recList.relationships.contents;
          console.log(items);
          const isGroup = recList.attributes.isGroupRecommendation;

          return (
            <>
              <h3>{recList.attributes.title.stringForDisplay}</h3>
              <div className={cx(classes.scrollWrapper, {[classes.groupedScroller]: isGroup})}>
                <div className={classes.scrollGrid}>
                  {items.data.map((item, i) => {
                    switch (item.type) {
                      case 'playlists':
                        return (
                          <PlaylistItem key={i} playlist={item} size={120}/>
                        );
                      case 'albums':
                        return (
                          <AlbumItem key={i} album={item} size={120}/>
                        );
                      case 'personal-recommendation':
                        return (
                          <div className={classes.recommendationGroup}>
                            <h4>{item.attributes.reason.stringForDisplay}</h4>
                            <div className={classes.personalRecommendationsGrid}>
                              {item.relationships.contents.data.map((item) => {
                                switch (item.type) {
                                  case 'playlists':
                                    return (
                                      <PlaylistItem key={i} playlist={item} size={100} />
                                    );
                                  case 'albums':
                                    return (
                                      <AlbumItem key={i} album={item} size={100} />
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
            </>
          );
        })}

        <h3>Heavy Rotation</h3>
        <div className={classes.flexGrid}>
          {heavyRotation ? (
            heavyRotation.map((item, i) => {
              switch (item.type) {
                case 'playlists':
                  return (
                    <PlaylistItem key={i} playlist={item} size={120}/>
                  );
                case 'albums':
                  return (
                    <AlbumItem key={i} album={item} size={120}/>
                  );
                default:
                  return null
              }
            }) 
          ) : (
            <Loader/>
          )}
        </div>
        <h3>Recently played</h3>
        <div className={classes.flexGrid}>
          {recentlyPlayed ? (
            recentlyPlayed.map((item, i) => {
              switch (item.type) {
                case 'playlists':
                  return (
                    <PlaylistItem key={i} playlist={item} size={120}/>
                  );
                case 'albums':
                  return (
                    <AlbumItem key={i} album={item} size={120}/>
                  );
                default:
                  return null
              }
            }) 
          ) : (
            <Loader/>
          )}
        </div>
      </PageContent>
    );
  }
}

export default withRouter(OverviewPage);
