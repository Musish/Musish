import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import NavigationBar from './NavigationBar/NavigationBar';
import Sidebar from './Sidebar/Sidebar';
import Queue from '../Player/Queue/Queue';
import withContext from '../../../hoc/withContext';
import ModalContext from '../../common/Modal/ModalContext';

class Layout extends Component {
  componentDidMount() {
    const { history, flush } = this.props;

    history.listen(() => {
      flush();
    });
  }

  render() {
    return (
      <Fragment>
        <NavigationBar />

        <div id="main-wrapper">
          <Queue />
          <Sidebar />
          <main id="main-content" className={this.props.className}>
            {this.props.children}
          </main>
        </div>
      </Fragment>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  history: PropTypes.any.isRequired,
  flush: PropTypes.any.isRequired,
};

Layout.defaultProps = {
  className: '',
};

export default withRouter(withContext(Layout, ModalContext));
