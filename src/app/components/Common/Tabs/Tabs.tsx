import cx from 'classnames';
import React, { ReactNode, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { matchPath, withRouter } from 'react-router-dom';
import { ITabProps } from './Tab';
import classes from './Tabs.scss';

interface ITabsProps extends RouteComponentProps {
  children: ReactNode;
}

const Tabs: React.FC<ITabsProps> = ({ children, location, history }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = React.Children.toArray(children);

  let selected = tabIndex;
  tabs.forEach((tab, index) => {
    const { route } = (tab! as any).props;
    if (route && matchPath(location.pathname, { path: route, exact: true })) {
      selected = index;
    }
  });

  return (
    <>
      <div className={classes.choices}>
        {tabs.map((tab, index) => {
          const { name: tabName, route: tabRoute } = (tab! as any).props as ITabProps;
          return (
            <div
              key={tabRoute || tabName}
              className={cx(classes.selectionItem, {
                [classes.selected]: index === selected,
              })}
              onClick={() => {
                if (tabRoute) {
                  history.push(tabRoute);
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
};

export default withRouter(Tabs);
