/// <reference path="./ActionContextTypes.d.ts" />
/**
* This is the Gadget server side types library for:
*
*   _ _           _                 _                 _            _   _____ 
*  | (_)_   _____| | ___   ___ __ _| | __ _  __ _  __| | __ _  ___| |_|___ / 
*  | | \ \ / / _ \ |/ _ \ / __/ _` | |/ _` |/ _` |/ _` |/ _` |/ _ \ __| |_ \ 
*  | | |\ V /  __/ | (_) | (_| (_| | | (_| | (_| | (_| | (_| |  __/ |_ ___) |
*  |_|_| \_/ \___|_|\___/ \___\__,_|_|\__, |\__,_|\__,_|\__, |\___|\__|____/ 
*                                     |___/             |___/                
*
* Built for environment `Development` at version 151
* Framework version: ^1.4.0
* Edit this app here: https://livelocalgadget3.gadget.dev/edit
*/
import type { Livelocalgadget3Client } from "@gadget-client/livelocalgadget3";
import { Logger } from "./AmbientContext.js";
export { InvalidRecordError } from "@gadgetinc/api-client-core";
export * from "./metadataFileTypes.js";
export * from "./AmbientContext.js";
export * from "./AppConfigs.js";
export * from "./AppConfiguration.js";
export * from "./AppConnections.js";
import { AppConnections } from "./AppConnections.js";
export * from "./auth.js";
export * as DefaultEmailTemplates from "./email-templates/index.js";
export * from "./emails.js";
export { InvalidStateTransitionError } from "./errors.js";
export * from "./global-actions.js";
export * from "./routes.js";
export * from "./state-chart/index.js";
export * from "./types.js";
export * from "./ActionOptions.js";
export * from "./effects.js";
export * from "./utils.js";
import type { RouteContext } from "./routes.js";
export { preventCrossShopDataAccess, ShopifyBulkOperationState, ShopifySellingPlanGroupProductState, ShopifySellingPlanGroupProductVariantState, ShopifyShopState, ShopifySyncState, abortSync, finishBulkOperation, globalShopifySync, shopifySync } from "./shopify/index.js";
/**
* @internal
*/
import { Globals, actionContextLocalStorage } from "./globals.js";
export * from "./models/Session.js";
export * from "./models/Booking.js";
export * from "./models/Event.js";
export * from "./models/Musician.js";
export * from "./models/Review.js";
export * from "./models/Venue.js";
export * from "./models/User.js";
/**
* A map of connection name to instantiated connection objects for the app.
*/
declare let connections: AppConnections;
/**
* An instance of the Gadget logger
*/
declare let logger: Logger;
/**
* An instance of the Gadget API client that has admin permissions
*/
declare let api: Livelocalgadget3Client;
/**
* This is used internally to set the connections.
* @internal
*/
export declare const setConnections: (appConnections: AppConnections) => void;
/**
* This is used internally to set the rootLogger.
* @internal
*/
export declare const setLogger: (rootLogger: Logger) => void;
/**
* This is used internally to set the client Instance
* @internal
*/
export declare const setApiClient: (client: Livelocalgadget3Client) => void;
export { api, logger, connections };
/**
* @internal
*/
export { Globals, actionContextLocalStorage };
declare module "react-router" {
	interface AppLoadContext extends RouteContext {}
}
