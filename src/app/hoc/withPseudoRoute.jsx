import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { setPseudoRoute } from '../utils/Utils';

function withPseudoRoute(Component, route) {
  return withRouter(props => {
    const link = route instanceof Function ? route(props) : route;
    if (props.pseudoRoute) {
      useEffect(() => {
        setPseudoRoute(link);

        return () => {
          if (window.location.pathname === link) {
            setPseudoRoute(props.location.pathname);
          }
        };
      }, []);
    }

    return <Component {...props} />;
  });
}

withPseudoRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

withPseudoRoute.defaultTypes = {
  children: null,
};

export default withPseudoRoute;
