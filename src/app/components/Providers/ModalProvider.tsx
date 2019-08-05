import Mousetrap from 'mousetrap';
import React, { CSSProperties, ReactNode, useContext, useState } from 'react';
import Modal from '../Common/Modal/Modal';

export const ModalContext = React.createContext({});

interface IModal {
  content: ReactNode;
  style: CSSProperties;
}

export interface IModalProviderValue {
  queue: IModal[];
  push: (content: ReactNode, style?: CSSProperties) => void;
  replace: (content: ReactNode, style?: CSSProperties) => void;
  pop: () => void;
  flush: () => void;
}

function ModalProvider({ children = null }: { children: ReactNode }) {
  const [modals, setModals] = useState<IModal[]>([]);

  const state: IModalProviderValue = {
    queue: modals,
    push: (content, style = {}) => setModals([{ content, style }, ...modals]),
    replace: (content, style = {}) => setModals([...modals.slice(0, -1), { content, style }]),
    pop: () => setModals(modals.slice(1)),
    flush: () => setModals([]),
  };

  Mousetrap.bind('esc', state.pop, 'keyup');

  return <ModalContext.Provider value={state}>{children}</ModalContext.Provider>;
}

export default ModalProvider;

export function withModal(Component: any) {
  return (props: {}) => (
    <ModalContext.Consumer>
      {context => <Component {...props} modal={{ ...context }} />}
    </ModalContext.Consumer>
  );
}

export function useModal(): IModalProviderValue {
  return useContext(ModalContext) as IModalProviderValue;
}

export function ModalRenderer() {
  const { queue, pop } = useModal();
  const modal = queue[0];

  if (!modal) {
    return null;
  }

  return (
    <Modal key={queue.length} handleClose={pop} render={() => modal.content} style={modal.style} />
  );
}
