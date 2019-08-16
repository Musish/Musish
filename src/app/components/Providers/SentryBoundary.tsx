import * as Sentry from '@sentry/browser';
import React, { ReactNode } from 'react';

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

interface SentryBoundaryProps {
  children: ReactNode;
}

class SentryBoundary extends React.Component<SentryBoundaryProps, { error: any }> {
  constructor(props: SentryBoundaryProps) {
    super(props);

    this.state = { error: null };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  public render() {
    if (this.state.error) {
      return <CrashPage />;
    }

    return this.props.children;
  }
}

export default SentryBoundary;
