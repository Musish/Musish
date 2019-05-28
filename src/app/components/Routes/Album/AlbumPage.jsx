import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PageContent from '../../Common/PageContent/PageContent';
import PageTitle from '../../Common/PageTitle/PageTitle';
import translate from '../../../utils/translations/Translations';
import AlbumPanel from '../../Common/AlbumPanel/AlbumPanel';
import classes from './AlbumPage.scss';

function AlbumPage(props) {
  const scrollRef = React.createRef();

  const albumId = props.match.params.id;

  return (
    <PageContent innerRef={scrollRef}>
      <PageTitle
        title={null}
        context={isNaN(albumId) ? translate.myLibrary : translate.appleMusic}
      />

      <AlbumPanel id={albumId} className={classes.albumPanel} />
    </PageContent>
  );
}

AlbumPage.propTypes = {
  id: PropTypes.any,
  match: PropTypes.object,
};

AlbumPage.defaultProps = {
  id: null,
  match: null,
};

export default withRouter(AlbumPage);
