import React, { ReactNode, useContext, useState } from 'react';

export interface LyricsModalProps {
  lyricsModal: LyricsModalProviderValue;
}

interface LyricsModalProviderValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const LyricsModalContext = React.createContext<LyricsModalProviderValue>({
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

export function withLyricsModal<T extends LyricsModalProps>(
  Component: React.ComponentType<T>,
): React.ComponentType<Subtract<T, LyricsModalProps>> {
  return (props: Subtract<T, LyricsModalProps>) => (
    <LyricsModalContext.Consumer>
      {context => <Component {...props as T} lyricsModal={{ ...context }} />}
    </LyricsModalContext.Consumer>
  );
}

export function useLyricsModal() {
  return useContext(LyricsModalContext);
}
