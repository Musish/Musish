import React, { ReactNode, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

interface GoogleAnalyticsProviderProps extends RouteComponentProps {
  children: ReactNode;
}

const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({ children, history }) => {
  useEffect(() => {
    const ga = (window as any).ga;
    if (ga) {
      history.listen(location => {
        ga('set', 'page', location.pathname + location.search);
        ga('send', 'pageview');
      });
    }
  }, []);

  return <>{children}</>;
};

export default withRouter(GoogleAnalyticsProvider);
