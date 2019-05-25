import React from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';

function CrashPage() {
  return (
    <div>
      Oops, looks like something went wrong...
      <div>
        <a onClick={() => Sentry.showReportDialog()}>
          Help us solve this issue, report the error !
        </a>
      </div>
    </div>
  );
}

class SentryBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.error) {
      return <CrashPage />;
    }

    return this.props.children;
  }
}

SentryBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default SentryBoundary;
