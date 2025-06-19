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
