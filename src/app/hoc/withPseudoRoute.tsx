import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { setPseudoRoute } from '../utils/Utils';

interface WithPseudoRoute {
  pseudoRoute?: boolean;
}

function withPseudoRoute<P>(
  Component: React.ComponentType<P>,
  route: (props: RouteComponentProps & P) => string | string,
) {
  return withRouter((props: RouteComponentProps & WithPseudoRoute & P) => {
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

export default withPseudoRoute;
