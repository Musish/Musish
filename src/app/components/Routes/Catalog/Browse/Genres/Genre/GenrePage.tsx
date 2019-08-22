import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import * as MusicApi from '../../../../../../services/MusicApi';
import { artworkForMediaItem } from '../../../../../../utils/Utils';
import InfiniteLoader, {
  InfiniteLoaderOnScroll,
  InfiniteLoaderState,
} from '../../../../../Common/InfiniteLoader/InfiniteLoader';
import Loader from '../../../../../Common/Loader/Loader';
import PageContent from '../../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../../Common/PageTitle/PageTitle';
import PlaylistItem from '../../../../../Common/PlaylistItem/PlaylistItem';
import classes from './GenrePage.scss';

type GenrePageProps = RouteComponentProps<{ id: string }>;

interface GenrePageState {
  curatorId: any;
  curator: any;
}

class GenrePage extends React.Component<GenrePageProps, GenrePageState> {
  public static renderContent(
    _: InfiniteLoaderOnScroll,
    { items }: InfiniteLoaderState<MusicKit.Resource>,
  ) {
    if (!items) {
      return null;
    }

    return (
      <div className={classes.playlistGrid}>
        {items.map((playlist: MusicKit.Resource) => (
          <PlaylistItem key={playlist.id} playlist={playlist} size={160} />
        ))}
      </div>
    );
  }

  public static fetchPlaylists(playlists: MusicKit.Resource[]) {
    return Promise.all(
      playlists.map(async playlist => await MusicKit.getInstance().api.playlist(playlist.id)),
    );
  }

  private readonly store = {};
  private readonly scrollRef = React.createRef<HTMLDivElement>();

  constructor(props: GenrePageProps) {
    super(props);

    this.state = {
      curatorId: this.props.match.params.id,
      curator: null,
    };
  }

  public componentDidMount() {
    this.fetchCurator();
  }

  public fetchCurator = async () => {
    const music = MusicKit.getInstance();

    const curator = await music.api.appleCurator(this.getCuratorId());

    this.setState({
      curator,
    });
  };

  public getCuratorId = () => this.state.curatorId;

  public curatorLoader = () => this.state.curator;

  public renderHeader = () => {
    const { curator } = this.state;

    if (!curator) {
      return null;
    }

    const artwork = artworkForMediaItem(curator, 200);

    const styles = {
      background: `url(${artwork})`,
    };

    return (
      <div className={classes.curatorHeader} style={styles}>
        <div className={classes.curatorHeaderContainer}>
          <div className={classes.curatorHeaderPicture} style={styles} />
        </div>
      </div>
    );
  };

  public render() {
    const { curator } = this.state;

    if (!curator) {
      return <Loader />;
    }

    return (
      <PageContent innerRef={this.scrollRef}>
        {this.renderHeader()}
        <PageTitle context={'Genres'} title={curator.attributes.name} />

        <p>{curator.attributes.editorialNotes.short}</p>

        <InfiniteLoader
          scrollElement={this.scrollRef}
          load={MusicApi.infiniteLoadRelationships(
            this.getCuratorId(),
            this.curatorLoader,
            'playlists',
            this.store,
            GenrePage.fetchPlaylists,
          )}
          render={GenrePage.renderContent}
          limit={10}
        />
      </PageContent>
    );
  }
}

export default withRouter(GenrePage);
