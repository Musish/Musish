import React, { ReactNode, useContext, useState } from 'react';

interface ILyricsModalProviderProps {
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

export function withLyricsModal<P extends ILyricsModalProviderProps>(
  Component: React.ComponentType<P>,
) {
  return (props: P) => (
    <LyricsModalContext.Consumer>
      {context => <Component {...props} lyricsModal={{ ...context }} />}
    </LyricsModalContext.Consumer>
  );
}

export function useLyricsModal() {
  return useContext(LyricsModalContext);
}
