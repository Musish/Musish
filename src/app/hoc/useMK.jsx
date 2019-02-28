import { useState, useEffect } from 'react';

export default function useMK(bindings) {
  const [event, setEvent] = useState({});

  function handleEventChange(status, e) {
    const temp = event;
    temp[status] = e;
    setEvent(temp);
  }

  useEffect(() => {
    const bindingFunctions = {};
    for (const eventMK of Object.keys(bindings)) {
      const tempEvent = bindings[eventMK];
      const handler = e => handleEventChange(tempEvent, e);
      bindingFunctions[eventMK] = handler;
      MusicKit.getInstance().addEventListener(eventMK, handler);
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      for (const eventMK of Object.keys(bindings)) {
        MusicKit.getInstance().removeEventListener(eventMK, bindingFunctions[eventMK]);
        delete bindingFunctions[eventMK];
      }
    };
  });

  return {
    instance: MusicKit.getInstance(),
    ...event,
  };
}
