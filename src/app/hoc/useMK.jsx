import { useState, useEffect } from 'react';

export default function useMK(bindings) {
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
    // Specify how to clean up after this effect:
    return function cleanup() {
      for (const eventName of Object.keys(bindings)) {
        MusicKit.getInstance().removeEventListener(eventName, bindingFunctions[eventName]);
        delete bindingFunctions[eventName];
      }
    };
  });

  return {
    instance: MusicKit.getInstance(),
    ...events,
  };
}
