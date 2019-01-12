import React from 'react';
import { Route } from 'react-router-dom';

import ArtistAlbums from './ArtistAlbums';
import ArtistsList from './ArtistsList';

export default function ArtistsPage() {
  return (
    <>
      <ArtistsList />
      <Route
        path={'/me/artists/:id'}
        exact
        render={({
          match: {
            params: { id },
          },
        }) => <ArtistAlbums key={id} id={id} />}
      />
    </>
  );
}
