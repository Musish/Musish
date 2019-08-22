import MusicKitInstance = MusicKit.MusicKitInstance;

interface BindingsType {
  [s: string]: string;
}

type MKEvent = any;

declare interface MusishMK<E extends BindingsType = {}> {
  // Allow `instance` to not be a string, eventually all events should go under their own property
  // @ts-ignore
  instance: MusicKitInstance;
  // [N in keyof E]: E[N]; // This is what we want, but TS doesn't allow it...
  [s: string]: any;
}

declare interface MKProps {
  mk: MusishMK;
}
