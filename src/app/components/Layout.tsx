import Mousetrap from 'mousetrap';
import React, { ReactNode, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import NavigationBar from './Common/NavigationBar/NavigationBar';
import Queue from './Common/Player/Queue/Queue';
import Sidebar from './Common/Sidebar/Sidebar';
import * as classes from './Layout.scss';
import { ModalProps, withModal } from './Providers/ModalProvider';
import { useTheme } from './Providers/ThemeProvider';

interface LayoutProps extends RouteComponentProps, ModalProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ history, modal, children }) => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    history.listen(() => {
      modal.flush();
    });
  }, []);

  useEffect(() => {
    document.body.className = `theme-${theme}`;

    Mousetrap.bind('d', () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    });
  }, [theme]);

  return (
    <>
      <NavigationBar />

      <div className={classes.mainWrapper}>
        <Queue />
        <Sidebar />
        <main className={classes.mainContent}>{children}</main>
      </div>
    </>
  );
};

export default withRouter(withModal(Layout));
