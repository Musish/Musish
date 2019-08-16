import React, { ReactNode, useContext, useState } from 'react';

interface QueueModalValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export interface QueueModalProps {
  queueModal: QueueModalValue;
}

export const QueueModalContext = React.createContext<QueueModalValue>({
  isOpen: false,
  open: () => undefined,
  close: () => undefined,
});

function QueueModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const state: QueueModalValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <QueueModalContext.Provider value={state}>{children}</QueueModalContext.Provider>;
}

export default QueueModalProvider;

export function withQueueModal<T extends QueueModalProps>(
  Component: React.ComponentType<T>,
): React.ComponentType<Subtract<T, QueueModalProps>> {
  return (props: Subtract<T, QueueModalProps>) => (
    <QueueModalContext.Consumer>
      {context => <Component {...props as T} queueModal={{ ...context }} />}
    </QueueModalContext.Consumer>
  );
}

export function useQueueModal() {
  return useContext(QueueModalContext);
}
