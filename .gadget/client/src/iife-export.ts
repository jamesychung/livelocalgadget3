import { Livelocalgadget3Client } from ".";

declare global {
  interface Window {
    /**
     * The Gadget client constructor
     *
     * @example
     * ```ts
     * const api = new Livelocalgadget3Client();
     * ```
     */
    Livelocalgadget3Client: typeof Livelocalgadget3Client;

    /**
     * The Gadget client for Livelocalgadget3Client
     * @deprecated Use window.Livelocalgadget3Client instead
     */
    Gadget: typeof Livelocalgadget3Client;
  }
}

// add the client to the window
window.Livelocalgadget3Client = Livelocalgadget3Client;

const previousValue: any = window.Gadget;

// add the client to the window at the old .Gadget property for backwards compatibility -- the Livelocalgadget3Client property should be preferred instead
window.Gadget = Livelocalgadget3Client;
(window.Gadget as any).previousValue = previousValue;
