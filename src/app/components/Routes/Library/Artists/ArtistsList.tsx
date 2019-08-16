import cx from 'classnames';
import React, { useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, Route, withRouter } from 'react-router-dom';
import InfiniteScroll, {
  InfiniteScrollListRowProps,
} from '../../../Common/InfiniteLoader/InfiniteScroll';
import classes from './ArtistsPage.scss';
import Resource = MusicKit.Resource;

type ArtistsListProps = RouteComponentProps;

function rowRenderer({ item: artist, key, style }: InfiniteScrollListRowProps<Resource>) {
  const path = `/me/artists/${artist.id}`;
  const initials = artist.attributes.name
    .split(' ')
    .map((n: string) => n.substring(0, 1))
    .filter((c: string) => !/[^a-zA-Z0-9]/.test(c))
    .slice(0, 2);
  return (
    <li key={key} style={style}>
      <Route path={path} exact>
        {({ match }) => (
          <Link to={path} className={cx(classes.artist, match ? classes.activeArtist : null)}>
            <div className={classes.artistBacker} />
            <div>
              <span className={classes.pictureWrapper}>
                <span>{initials}</span>
              </span>
            </div>
            <div>
              <div className={classes.artistName}>{artist.attributes.name}</div>
            </div>
          </Link>
        )}
      </Route>
    </li>
  );
}

async function load(params: { limit: number; offset: number }) {
  const music = MusicKit.getInstance();

  return await music.api.library.artists(null, params);
}

const ArtistsList: React.FC<ArtistsListProps> = ({ history, location }: ArtistsListProps) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <aside className={classes.artistList} ref={ref}>
      <ul>
        <InfiniteScroll<Resource>
          scrollElement={ref}
          rowHeight={60}
          load={load}
          rowRenderer={rowRenderer}
          onSetItems={({ items }) => {
            const { pathname } = location;

            if (!items) {
              return;
            }

            if (pathname === `/me/artists` && items.length > 0) {
              history.push(`/me/artists/${(items[0] as any).id}`);
            }
          }}
        />
      </ul>
    </aside>
  );
};

export default withRouter(ArtistsList);
