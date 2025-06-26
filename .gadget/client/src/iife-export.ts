import { Livelocalgadget6Client } from ".";

declare global {
  interface Window {
    /**
     * The Gadget client constructor
     *
     * @example
     * ```ts
     * const api = new Livelocalgadget6Client();
     * ```
     */
    Livelocalgadget6Client: typeof Livelocalgadget6Client;

    /**
     * The Gadget client for Livelocalgadget6Client
     * @deprecated Use window.Livelocalgadget6Client instead
     */
    Gadget: typeof Livelocalgadget6Client;
  }
}

// add the client to the window
window.Livelocalgadget6Client = Livelocalgadget6Client;

const previousValue: any = window.Gadget;

// add the client to the window at the old .Gadget property for backwards compatibility -- the Livelocalgadget6Client property should be preferred instead
window.Gadget = Livelocalgadget6Client;
(window.Gadget as any).previousValue = previousValue;
