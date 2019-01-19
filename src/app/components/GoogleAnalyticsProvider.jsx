import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class GoogleAnalyticsProvider extends React.Component {
  componentDidMount() {
    if (window.ga) {
      this.props.history.listen(location => {
        window.ga('set', 'page', location.pathname + location.search);
        window.ga('send', 'pageview');
      });
    }
  }

  render() {
    return this.props.children;
  }
}

GoogleAnalyticsProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  history: PropTypes.any.isRequired,
};

export default withRouter(GoogleAnalyticsProvider);
