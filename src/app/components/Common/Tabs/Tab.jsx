import PropTypes from 'prop-types';

function Tab({ children }) {
  return children;
}

Tab.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Tab;
