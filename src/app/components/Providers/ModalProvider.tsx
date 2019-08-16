import Mousetrap from 'mousetrap';
import React, { CSSProperties, ReactNode, useContext, useState } from 'react';
import Modal from '../Common/Modal/Modal';

export const ModalContext = React.createContext<ModalProviderValue>({
  queue: [],
  push: () => undefined,
  replace: () => undefined,
  pop: () => undefined,
  flush: () => undefined,
});

export interface ModalProps {
  modal: ModalProviderValue;
}

interface Modal {
  content: ReactNode;
  style: CSSProperties;
}

export interface ModalProviderValue {
  queue: Modal[];
  push: (content: ReactNode, style?: CSSProperties) => void;
  replace: (content: ReactNode, style?: CSSProperties) => void;
  pop: () => void;
  flush: () => void;
}

function ModalProvider({ children = null }: { children: ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([]);

  const state: ModalProviderValue = {
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

export function withModal<T extends ModalProps>(
  Component: React.ComponentType<T>,
): React.ComponentType<Subtract<T, ModalProps>> {
  return (props: Subtract<T, ModalProps>) => (
    <ModalContext.Consumer>
      {context => <Component {...props as T} modal={{ ...context }} />}
    </ModalContext.Consumer>
  );
}

export function useModal(): ModalProviderValue {
  return useContext(ModalContext) as ModalProviderValue;
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
