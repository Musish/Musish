import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Common/Modal/Modal';
import Mousetrap from 'mousetrap';

export const ModalContext = React.createContext({});

function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const state = {
    queue: modals,
    push: (content, style = {}) => setModals([{ content, style }, ...modals]),
    replace: (content, style = {}) => setModals([...modals.slice(0, -1), { content, style }]),
    pop: () => setModals(modals.slice(1)),
    flush: () => setModals([]),
  };

  Mousetrap.bind('esc', state.pop, 'keyup');

  return <ModalContext.Provider value={state}>{children}</ModalContext.Provider>;
}

ModalProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

ModalProvider.defaultTypes = {
  children: null,
};

export default ModalProvider;

export function withModal(Component) {
  return props => (
    <ModalContext.Consumer>
      {context => <Component {...props} modal={{ ...context }} />}
    </ModalContext.Consumer>
  );
}

export function useModal() {
  return useContext(ModalContext);
}

export function ModalRenderer() {
  const { queue, pop } = useModal();
  const modal = queue[0];

  if (!modal) {
    return null;
  }

  return (
    <Modal
      key={queue.length}
      open
      handleClose={pop}
      render={() => modal.content}
      style={modal.style}
    />
  );
}
