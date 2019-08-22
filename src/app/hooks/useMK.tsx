import { useEffect, useState } from 'react';

export default function useMK<B extends BindingsType>(bindings: B = {} as B): MusishMK<B> {
  type BindingsEvent = { [s in keyof B]: MKEvent };
  type BindingsList = keyof B;

  const [events, setEvents] = useState<BindingsEvent>({} as BindingsEvent);

  function handleEventChange(key: string, e: MKEvent) {
    setEvents(previousEvents => ({
      ...previousEvents,
      [key]: e,
    }));
  }

  useEffect(() => {
    const bindingFunctions: { [s in BindingsList]?: MKEvent } = {};

    for (const [key, eventName] of Object.entries(bindings)) {
      const handler = (e: MKEvent) => handleEventChange(key!, e);

      bindingFunctions[eventName as BindingsList] = handler;
      // @ts-ignore
      MusicKit.getInstance().addEventListener(eventName, handler);
    }

    return () => {
      for (const [eventName, func] of Object.entries<MKEvent>(bindingFunctions)) {
        // @ts-ignore
        MusicKit.getInstance().removeEventListener(eventName, func);
        delete bindingFunctions[eventName as BindingsList];
      }
    };
  }, []);

  return {
    instance: MusicKit.getInstance(),
    ...events,
  };
}
