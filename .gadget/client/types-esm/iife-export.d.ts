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
