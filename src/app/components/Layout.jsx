import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NavigationBar from './Common/NavigationBar/NavigationBar';
import Sidebar from './Common/Sidebar/Sidebar';
import Queue from './Common/Player/Queue/Queue';
import { withModal } from './Providers/ModalProvider';
import { withRouter } from 'react-router-dom';

class Layout extends Component {
  componentDidMount() {
    const { history, modal } = this.props;

    history.listen(() => {
      modal.flush();
    });
  }

  render() {
    return (
      <Fragment>
        <NavigationBar />

        <div id='main-wrapper'>
          <Queue />
          <Sidebar />
          <main id='main-content' className={this.props.className}>
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
  modal: PropTypes.object.isRequired,
};

Layout.defaultProps = {
  className: '',
};

export default withRouter(withModal(Layout));
