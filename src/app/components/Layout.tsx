import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import NavigationBar from './Common/NavigationBar/NavigationBar';
import Queue from './Common/Player/Queue/Queue';
import Sidebar from './Common/Sidebar/Sidebar';
import { ModalProps, withModal } from './Providers/ModalProvider';

interface LayoutProps extends RouteComponentProps, ModalProps {
  children: ReactNode;
}

class Layout extends Component<LayoutProps> {
  public componentDidMount() {
    const { history, modal } = this.props;

    history.listen(() => {
      modal.flush();
    });
  }

  public render() {
    return (
      <>
        <NavigationBar />

        <div id='main-wrapper'>
          <Queue />
          <Sidebar />
          <main id='main-content'>{this.props.children}</main>
        </div>
      </>
    );
  }
}

export default withRouter(withModal(Layout));
