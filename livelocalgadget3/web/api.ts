/**
 * This is the Gadget API client library for:
 *
 *   _ _           _                 _                 _            _   _____ 
 *  | (_)_   _____| | ___   ___ __ _| | __ _  __ _  __| | __ _  ___| |_|___ / 
 *  | | \ \ / / _ \ |/ _ \ / __/ _` | |/ _` |/ _` |/ _` |/ _` |/ _ \ __| |_ \ 
 *  | | |\ V /  __/ | (_) | (_| (_| | | (_| | (_| | (_| | (_| |  __/ |_ ___) |
 *  |_|_| \_/ \___|_|\___/ \___\__,_|_|\__, |\__,_|\__,_|\__, |\___|\__|____/ 
 *                                     |___/             |___/                
 *
 * Built for environment "Development" at version 155
 * API docs: https://docs.gadget.dev/api/livelocalgadget3
 * Edit this app here: https://livelocalgadget3.gadget.app/edit
 */

// @ts-ignore - Import from generated client
export * from "../.gadget/client/dist-esm/index.js";

// @ts-ignore - Import from generated client
import { Client } from "../.gadget/client/dist-esm/Client.js";

export const api = new Client({
  environment: "Development",
  authenticationMode: { browserSession: { storageType: "localStorage" as const } },
}); 