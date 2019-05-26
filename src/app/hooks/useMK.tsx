import { useEffect, useState } from 'react';

export default function useMK(bindings: {[s: string]: string} = {}) {
  const [events, setEvents] = useState<{[s: string]: string}>({});

  function handleEventChange(key: string, e) {
    setEvents({
      ...events,
      [key]: e,
    });
  }

  useEffect(() => {
    const bindingFunctions = {};

    for (const [eventName, key] of Object.entries(bindings)) {
      const handler = (e) => handleEventChange(key, e);
      bindingFunctions[eventName] = handler;
      // @ts-ignore
      MusicKit.getInstance().addEventListener(eventName, handler);
    }

    return () => {
      for (const [eventName, func] of Object.entries(bindingFunctions)) {
        // @ts-ignore
        MusicKit.getInstance().removeEventListener(eventName, func);
        delete bindingFunctions[eventName];
      }
    };
  });

  return {
    instance: MusicKit.getInstance(),
    ...events,
  };
}
