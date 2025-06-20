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
* Built for environment "Development" at version 151
* API docs: https://docs.gadget.dev/api/livelocalgadget3
* Edit this app here: https://livelocalgadget3.gadget.app/edit
*/
export { BrowserSessionStorageType, GadgetClientError, GadgetConnection, GadgetInternalError, GadgetOperationError, GadgetRecord, GadgetRecordList, GadgetValidationError, InvalidRecordError, ChangeTracking } from "@gadgetinc/api-client-core";
export type { AuthenticationModeOptions, BrowserSessionAuthenticationModeOptions, ClientOptions, InvalidFieldError, Select } from "@gadgetinc/api-client-core";
export * from "./Client.js";
export * from "./types.js";
declare global {
    interface Window {
        gadgetConfig: {
            apiKeys: {
                shopify: string;
            };
            environment: string;
            env: Record<string, any>;
            authentication?: {
                signInPath: string;
                redirectOnSuccessfulSignInPath: string;
            };
            shopifyInstallState?: {
                redirectToOauth: boolean;
                isAuthenticated: boolean;
                missingScopes: string[];
                shopExists: boolean;
            };
            shopifyAppBridgeCDNScriptSrc?: string;
        };
    }
}
