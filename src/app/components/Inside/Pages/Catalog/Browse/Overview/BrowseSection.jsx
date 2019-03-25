import React from 'react';
import PropTypes from 'prop-types';
import TracksGrid from '../../../../../Common/Tracks/TracksGrid/TracksGrid';
import TilePanel from '../Panels/TilePanel';
import FeaturePanel from '../Panels/FeaturePanel';

function BrowseSection({ section }) {
  function renderContent() {
    switch (section.type) {
      case 'FEATURE':
        return <FeaturePanel items={section.content} />;
      case 'TILE':
        return <TilePanel items={section.content} size={160} />;
      case 'TILE_LARGE':
        return <TilePanel items={section.content} size={300} />;
      case 'SONG':
        return <TracksGrid tracks={section.content} showArtist showAlbum />;
      default:
        return null;
    }
  }

  return (
    <>
      {section.name && <h3>{section.name}</h3>}
      {renderContent()}
    </>
  );
}

BrowseSection.propTypes = {
  section: PropTypes.object.isRequired,
};

export default BrowseSection;
