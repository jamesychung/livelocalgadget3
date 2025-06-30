/// <reference path="./ActionContextTypes.d.ts" />
/**
* This is the Gadget server side types library for:
*
*   _ _           _                 _                 _            _    __   
*  | (_)_   _____| | ___   ___ __ _| | __ _  __ _  __| | __ _  ___| |_ / /_  
*  | | \ \ / / _ \ |/ _ \ / __/ _` | |/ _` |/ _` |/ _` |/ _` |/ _ \ __| '_ \ 
*  | | |\ V /  __/ | (_) | (_| (_| | | (_| | (_| | (_| | (_| |  __/ |_| (_) |
*  |_|_| \_/ \___|_|\___/ \___\__,_|_|\__, |\__,_|\__,_|\__, |\___|\__|\___/ 
*                                     |___/             |___/                
*
* Built for environment `Development` at version 579
* Framework version: ^1.4.0
* Edit this app here: https://livelocalgadget6.gadget.dev/edit
*/
import type { Livelocalgadget6Client } from "@gadget-client/livelocalgadget6";
import { Logger } from "./AmbientContext";
export { InvalidRecordError } from "@gadgetinc/api-client-core";
export * from "./metadataFileTypes";
export * from "./AmbientContext";
export * from "./AppConfigs";
export * from "./AppConfiguration";
export * from "./AppConnections";
import { AppConnections } from "./AppConnections";
export * from "./auth";
export * as DefaultEmailTemplates from "./email-templates/index";
export * from "./emails";
export { InvalidStateTransitionError } from "./errors";
export * from "./global-actions";
export * from "./routes";
export * from "./state-chart/index";
export * from "./types";
export * from "./ActionOptions";
export * from "./effects";
export * from "./utils";
import type { RouteContext } from "./routes";
export { preventCrossShopDataAccess, ShopifyBulkOperationState, ShopifySellingPlanGroupProductState, ShopifySellingPlanGroupProductVariantState, ShopifyShopState, ShopifySyncState, abortSync, finishBulkOperation, globalShopifySync, shopifySync } from "./shopify/index";
/**
* @internal
*/
import { Globals, actionContextLocalStorage } from "./globals";
export * from "./models/Booking";
export * from "./models/Event";
export * from "./models/Musician";
export * from "./models/Review";
export * from "./models/Venue";
export * from "./models/User";
export * from "./models/Session";
export * from "./models/EventHistory";
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
declare let api: Livelocalgadget6Client;
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
export declare const setApiClient: (client: Livelocalgadget6Client) => void;
export { api, logger, connections };
/**
* @internal
*/
export { Globals, actionContextLocalStorage };
declare module "react-router" {
	interface AppLoadContext extends RouteContext {}
}
