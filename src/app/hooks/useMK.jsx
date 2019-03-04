import { useState, useEffect } from 'react';

export default function useMK(bindings = {}) {
  const [events, setEvents] = useState({});

  function handleEventChange(key, e) {
    setEvents({
      ...events,
      [key]: e,
    });
  }

  useEffect(() => {
    const bindingFunctions = {};

    for (const [eventName, key] of Object.entries(bindings)) {
      const handler = e => handleEventChange(key, e);
      bindingFunctions[eventName] = handler;
      MusicKit.getInstance().addEventListener(eventName, handler);
    }

    return () => {
      for (const [eventName, func] of Object.entries(bindingFunctions)) {
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
