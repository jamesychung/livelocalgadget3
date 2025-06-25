"use strict";
var import__ = require(".");
window.Livelocalgadget3Client = import__.Livelocalgadget3Client;
const previousValue = window.Gadget;
window.Gadget = import__.Livelocalgadget3Client;
window.Gadget.previousValue = previousValue;
//# sourceMappingURL=iife-export.js.map
