import React, { ReactNode, useContext, useState } from 'react';

export interface ILyricsModalProps {
  lyricsModal: ILyricsModalProviderValue;
}

interface ILyricsModalProviderValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const LyricsModalContext = React.createContext<ILyricsModalProviderValue>({
  isOpen: false,
  open: () => undefined,
  close: () => undefined,
});

function LyricsModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const state = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <LyricsModalContext.Provider value={state}>{children}</LyricsModalContext.Provider>;
}

export default LyricsModalProvider;

export function withLyricsModal<T extends ILyricsModalProps>(
  Component: React.ComponentType<T>,
): React.ComponentType<Subtract<T, ILyricsModalProps>> {
  return (props: Subtract<T, ILyricsModalProps>) => (
    <LyricsModalContext.Consumer>
      {context => <Component {...props as T} lyricsModal={{ ...context }} />}
    </LyricsModalContext.Consumer>
  );
}

export function useLyricsModal() {
  return useContext(LyricsModalContext);
}
