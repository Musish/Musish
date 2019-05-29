import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PageContent from '../../Common/PageContent/PageContent';
import PageTitle from '../../Common/PageTitle/PageTitle';
import translate from '../../../utils/translations/Translations';
import PlaylistPanel from '../../Common/PlaylistPanel/PlaylistPanel';

function PlaylistPage(props) {
  const scrollRef = React.createRef();

  const playlistId = props.match.params.id;

  return (
    <PageContent innerRef={scrollRef}>
      <PageTitle
        title={null}
        context={isNaN(playlistId) ? translate.myLibrary : translate.appleMusic}
      />

      <PlaylistPanel id={playlistId} />
    </PageContent>
  );
}

PlaylistPage.propTypes = {
  id: PropTypes.any,
  match: PropTypes.object,
};

PlaylistPage.defaultProps = {
  id: null,
  match: null,
};

export default withRouter(PlaylistPage);
