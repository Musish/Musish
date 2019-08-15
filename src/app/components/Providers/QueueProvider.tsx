import React, { ReactNode, useContext, useState } from 'react';

interface IQueueModalValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export interface IQueueModalProps {
  queueModal: IQueueModalValue;
}

export const QueueModalContext = React.createContext<IQueueModalValue>({
  isOpen: false,
  open: () => undefined,
  close: () => undefined,
});

function QueueModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const state: IQueueModalValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <QueueModalContext.Provider value={state}>{children}</QueueModalContext.Provider>;
}

export default QueueModalProvider;

export function withQueueModal<T extends IQueueModalProps>(
  Component: React.ComponentType<T>,
): React.ComponentType<Subtract<T, IQueueModalProps>> {
  return (props: Subtract<T, IQueueModalProps>) => (
    <QueueModalContext.Consumer>
      {context => <Component {...props as T} queueModal={{ ...context }} />}
    </QueueModalContext.Consumer>
  );
}

export function useQueueModal() {
  return useContext(QueueModalContext);
}
