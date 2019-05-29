import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const LyricsModalContext = React.createContext({});

function LyricsModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const state = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <LyricsModalContext.Provider value={state}>{children}</LyricsModalContext.Provider>;
}

LyricsModalProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

LyricsModalProvider.defaultTypes = {
  children: null,
};

export default LyricsModalProvider;

export function withLyricsModal(Component) {
  return props => (
    <LyricsModalContext.Consumer>
      {context => <Component {...props} lyricsModal={{ ...context }} />}
    </LyricsModalContext.Consumer>
  );
}

export function useLyricsModal() {
  return useContext(LyricsModalContext);
}
