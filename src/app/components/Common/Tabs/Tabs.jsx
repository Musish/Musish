import React, { useState } from 'react';
import { withRouter, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';

import classes from './Tabs.scss';

function Tabs({ children, ...props }) {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = React.Children.toArray(children);

  let selected = tabIndex;
  tabs.forEach((tab, index) => {
    const { route } = tab.props;
    if (route && matchPath(props.location.pathname, { path: route, exact: true })) {
      selected = index;
    }
  });

  return (
    <>
      <div className={classes.choices}>
        {tabs.map((tab, index) => {
          const { name: tabName, route: tabRoute } = tab.props;
          return (
            <div
              key={tabRoute || tabName}
              className={cx(classes.selectionItem, {
                [classes.selected]: index === selected,
              })}
              onClick={() => {
                if (tabRoute) {
                  props.history.push(tabRoute);
                }
                setTabIndex(index);
              }}
            >
              {tabName}
            </div>
          );
        })}
      </div>
      {tabs[selected]}
    </>
  );
}

Tabs.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  history: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
};

export default withRouter(Tabs);
