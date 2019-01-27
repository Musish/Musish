import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import PageContent from '../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import classes from './ForYouPage.scss';
import Loader from '../../../../Common/Loader/Loader';
import AlbumItem from '../../../../Common/AlbumItem/AlbumItem';
import PlaylistItem from '../../../../Common/PlaylistItem/PlaylistItem';
import translate from '../../../../../utils/translations/Translations';

class ForYouPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      heavyRotation: null,
      recentlyPlayed: null,
      recommendations: null,
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();

    let heavyRotation;
    try {
      heavyRotation = await music.api.historyHeavyRotation();
    } catch (error) {
      heavyRotation = false;
    }

    let recentlyPlayed;
    try {
      recentlyPlayed = await music.api.recentPlayed();
    } catch (error) {
      recentlyPlayed = false;
    }

    let recommendations;
    try {
      recommendations = await music.api.recommendations();
    } catch (error) {
      recommendations = false;
    }

    this.setState({
      heavyRotation,
      recentlyPlayed,
      recommendations,
    });
  }

  renderRecentlyPlayed() {
    const { recentlyPlayed } = this.state;

    if (recentlyPlayed === false) {
      return true; // No items
    }

    if (!recentlyPlayed) {
      return null; // Loading items
    }

    return (
      <>
        <h3>{translate.recentlyPlayed}</h3>
        <div className={cx(classes.scrollWrapper)}>
          <div className={classes.scrollGrid}>
            {recentlyPlayed.map(item => {
              switch (item.type) {
                case 'playlists':
                  return <PlaylistItem key={item.id} playlist={item} size={120} />;
                case 'albums':
                  return <AlbumItem key={item.id} album={item} size={120} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </>
    );
  }

  renderHeavyRotation() {
    const { heavyRotation } = this.state;

    if (heavyRotation === false) {
      return true; // No items
    }

    if (!heavyRotation) {
      return null; // Loading items
    }

    return (
      <>
        <h3>{translate.heavyRotation}</h3>
        <div className={classes.scrollWrapper}>
          <div className={classes.scrollGrid}>
            {heavyRotation.map(item => {
              switch (item.type) {
                case 'playlists':
                  return <PlaylistItem key={item.id} playlist={item} size={120} />;
                case 'albums':
                  return <AlbumItem key={item.id} album={item} size={120} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </>
    );
  }

  renderRecommendations() {
    const { recommendations } = this.state;

    if (recommendations === false) {
      return true; // No items
    }

    if (!recommendations) {
      return null; // Loading items
    }

    return (
      <>
        {recommendations.map(recList => {
          const items = recList.relationships.contents
            ? recList.relationships.contents
            : recList.relationships.recommendations;
          const isGroup = recList.attributes.isGroupRecommendation;
          return (
            <React.Fragment key={recList.id}>
              <h3>{recList.attributes.title.stringForDisplay}</h3>
              <div className={cx(classes.scrollWrapper)}>
                <div className={cx(classes.scrollWrapper, { [classes.groupedScroller]: isGroup })}>
                  <div className={classes.scrollGrid}>
                    {items.data.map((item, i) => {
                      switch (item.type) {
                        case 'playlists':
                          return <PlaylistItem key={item.id} playlist={item} size={120} />;
                        case 'albums':
                          return <AlbumItem key={item.id} album={item} size={120} />;
                        case 'personal-recommendation': {
                          const recommendationName = item.attributes.reason.stringForDisplay;
                          return (
                            <div
                              key={`${item.id}-${recommendationName}`}
                              className={classes.recommendationGroup}
                            >
                              <span className={classes.personalRecommendationsTitle}>
                                {recommendationName}
                              </span>
                              <div className={classes.personalRecommendationsGrid}>
                                {item.relationships.contents.data.map(subItem => {
                                  const subId = `${item.id}-${subItem.id}`;
                                  switch (subItem.type) {
                                    case 'playlists':
                                      return (
                                        <PlaylistItem key={subId} playlist={subItem} size={100} />
                                      );
                                    case 'albums':
                                      return <AlbumItem key={subId} album={subItem} size={100} />;
                                    default:
                                      return null;
                                  }
                                })}
                              </div>
                            </div>
                          );
                        }
                        default:
                          return null;
                      }
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </>
    );
  }

  render() {
    const recentlyPlayed = this.renderRecentlyPlayed();
    const heavyRotation = this.renderHeavyRotation();
    const recommendations = this.renderRecommendations();

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={translate.forYou} context={translate.appleMusic} />

        {!(recentlyPlayed && heavyRotation && recommendations) && <Loader />}

        {recentlyPlayed}
        {heavyRotation}
        {recommendations}
      </PageContent>
    );
  }
}

export default withRouter(ForYouPage);
