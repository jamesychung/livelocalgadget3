import { Livelocalgadget3Client } from ".";
window.Livelocalgadget3Client = Livelocalgadget3Client;
const previousValue = window.Gadget;
window.Gadget = Livelocalgadget3Client;
window.Gadget.previousValue = previousValue;
//# sourceMappingURL=iife-export.js.map
