import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const QueueModalContext = React.createContext({});

function QueueModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const state = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <QueueModalContext.Provider value={state}>{children}</QueueModalContext.Provider>;
}

QueueModalProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

QueueModalProvider.defaultTypes = {
  children: null,
};

export default QueueModalProvider;

export function withQueueModal(Component) {
  return props => (
    <QueueModalContext.Consumer>
      {context => <Component {...props} queueModal={{ ...context }} />}
    </QueueModalContext.Consumer>
  );
}

export function useQueueModal() {
  return useContext(QueueModalContext);
}
