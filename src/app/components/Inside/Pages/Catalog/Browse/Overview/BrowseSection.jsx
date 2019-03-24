import React from 'react';
import PropTypes from 'prop-types';
import TracksGrid from '../TopCharts/TopCharts';

function BrowseSection({ section }) {
  function renderContent() {
    switch (section.type) {
      case 'TILE':
      /*case 'SONG':
        return (
          <TracksGrid
            tracks={section.songs[0].data}
            showArtist
            showAlbum
            playTrack={TopCharts.playTrack}
          />
        );*/
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
