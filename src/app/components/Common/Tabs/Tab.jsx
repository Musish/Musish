import React from 'react';
import PropTypes from 'prop-types';

class Tab extends React.Component {
  render() {
    return this.props.children;
  }
}

Tab.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Tab;
