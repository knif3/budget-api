declare function Hound(): Hound.watch;

declare namespace Hound {
  export type watch = (path: string) => void;

  export interface on {

  }
}

export = Hound;
