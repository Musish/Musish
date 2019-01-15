import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import cx from 'classnames';

import classes from './Tabs.scss';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
  }

  render() {
    const { children } = this.props;
    const { tabIndex } = this.state;

    const tabs = React.Children.toArray(children);

    return (
      <>
        <div className={classes.choices}>
          {tabs.map((tab, index) => {
            const { name: tabName, route: tabRoute } = tab.props;
            return (
              <Route path={tabRoute} exact>
                {({ match }) => (
                  <div
                    className={cx(classes.selectionItem, {
                      [classes.selected]: tabRoute ? match : index === tabIndex,
                    })}
                    onClick={() => {
                      if (tabRoute) {
                        this.props.history.push(tabRoute);
                      }
                      this.setState({ tabIndex: index });
                    }}
                  >
                    {tabName}
                  </div>
                )}
              </Route>
            );
          })}
        </div>
        {tabs[tabIndex]}
      </>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  history: PropTypes.any.isRequired,
};

export default withRouter(Tabs);
