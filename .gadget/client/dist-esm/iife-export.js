import { Livelocalgadget6Client } from ".";
window.Livelocalgadget6Client = Livelocalgadget6Client;
const previousValue = window.Gadget;
window.Gadget = Livelocalgadget6Client;
window.Gadget.previousValue = previousValue;
//# sourceMappingURL=iife-export.js.map
