import { ChangeTracking, GadgetRecord } from "@gadgetinc/api-client-core";
import { InternalError, InvalidStateTransitionError, NoSessionForAuthenticationError, UserNotSetOnSessionError } from "./errors.js";
import { Globals, actionContextLocalStorage, kGlobals } from "./globals.js";
import { frameworkVersion, modelListIndex, modelsMap } from "./metadata.js";
import { assert } from "./utils.js";
export function getBelongsToRelationParams(model, params) {
    const belongsToParams = {};
    for (const field of Object.values(model.fields)){
        if (field.fieldType != "BelongsTo") continue;
        const modelParams = typeof params[model.apiIdentifier] === "object" ? params[model.apiIdentifier] : undefined;
        const belongsToParam = modelParams && typeof modelParams[field.apiIdentifier] === "object" ? modelParams[field.apiIdentifier] : undefined;
        const belongsToId = belongsToParam?.[LINK_PARAM] !== undefined ? belongsToParam[LINK_PARAM] : belongsToParam?.id;
        if (belongsToId !== undefined) {
            belongsToParams[`${field.apiIdentifier}Id`] = belongsToId;
        }
    }
    return belongsToParams;
}
export function createGadgetRecord(apiIdentifier, data) {
    const model = getModelByApiIdentifier(apiIdentifier);
    return new GadgetRecord({
        ...data,
        __typename: model.graphqlTypeName
    });
}
/**
 * Applies incoming API params (your model’s fields) to a record
 *
 * @param params - data passed from API calls, webhook events, or direct user inputs.
 * @param record - object used to pass params to
 */ export function applyParams(params, record) {
    const model = getModelByTypename(record.__typename);
    Object.assign(record, params[model.apiIdentifier], getBelongsToRelationParams(model, params));
}
/**
 * Get the internal model manager for the model from its maybe-namespaced spot
 */ export const internalModelManagerForModel = (api, apiIdentifier, namespace)=>{
    const modelPath = [
        ...namespace,
        apiIdentifier
    ];
    const manager = Globals.platformModules.lodash().get(api, [
        "internal",
        ...modelPath
    ]);
    if (!manager) {
        throw new InternalError(`Gadget needs but can't find an internal model manager for ${modelPath.join(".")} on the API client -- has it finished regenerating or was it recently removed?`);
    }
    return manager;
};
/**
 * Get the internal model manager for the model from its maybe-namespaced spot
 */ export const internalModelManagerForTypename = (api, typename)=>{
    const model = getModelByTypename(typename);
    return internalModelManagerForModel(api, model.apiIdentifier, model.namespace);
};
/**
 * Saves record to the database:
 * 1. Checks field validations of a given record, then saves the record to the database.
 * 2. Uses your apps Internal API to persist data. This API quickly interacts with data without running any business logic.
 *
 * @param record - object saved to the database
 */ export async function save(record) {
    const context = getCurrentContext();
    const api = assert(context.api, "api client is missing from the current context");
    const model = getModelByTypename(record.__typename);
    await (await context[kGlobals].modelValidator(model.key)).validate({
        api,
        logger: Globals.logger
    }, record);
    const internalModelManager = internalModelManagerForTypename(api, record.__typename);
    let result;
    if ("createdAt" in record && record.createdAt) {
        result = await internalModelManager.update(record.id, {
            [model.apiIdentifier]: changedAttributes(model, record)
        });
    } else {
        result = await internalModelManager.create({
            [model.apiIdentifier]: writableAttributes(model, record)
        });
    }
    Object.assign(record, {
        ...result
    });
    record.flushChanges(ChangeTracking.SinceLastPersisted);
}
/**
 * Deletes record from the database.
 *
 * @param record - object deleted from the database
 */ export async function deleteRecord(record) {
    const context = getCurrentContext();
    const api = assert(context.api, "api client is missing from the current context");
    const id = assert(record.id, `record.id not set on record in scope, has the record been persisted?`);
    const internalModelManager = internalModelManagerForTypename(api, record.__typename);
    await internalModelManager.delete(id);
    if ("scope" in context) {
        context.scope.recordDeleted = true;
    }
}
export function transitionState(record, transition) {
    const model = getModelByTypename(record.__typename);
    const isShopifyModel = model.apiIdentifier === "shopifyShop" || model.apiIdentifier === "shopifySync" || model.apiIdentifier === "shopifyBulkOperation";
    if (isShopifyModel && doesVersionSupportSourceControl()) {
        // In apps framework version 1.0.0+, we handle the state transition internally to Shopify models based on the above API identifiers.
        // This function becomes a no-op for those models.
        return;
    }
    const stringRecordState = typeof record.state === "string" ? record.state : JSON.stringify(record.state);
    const stringTransitionFrom = typeof transition.from === "string" ? transition.from : JSON.stringify(transition.from);
    if (transition.from && stringRecordState !== stringTransitionFrom) {
        throw new InvalidStateTransitionError(undefined, {
            state: record.state,
            expectedFrom: transition.from
        });
    }
    record.state = transition.to;
}
export function legacySetUser() {
    const context = getActionContextFromLocalStorage();
    if (!context.scope.authenticatedUser) {
        throw new UserNotSetOnSessionError("The authenticated user could not be saved to the session when logging in. Make sure the user has a role assigned to them.");
    }
    if (!context.session) {
        throw new NoSessionForAuthenticationError("Unable to authenticate because the request was made with no session in context to transition.");
    }
    context.session.set("user", {
        [LINK_PARAM]: context.scope.authenticatedUser.id
    });
}
export function legacyUnsetUser() {
    const context = getActionContextFromLocalStorage();
    if (!context.session) {
        throw new NoSessionForAuthenticationError("Unable to unset users on session because the request was made with no session.");
    }
    context.session.delete("user");
}
export async function legacySuccessfulAuthentication(params) {
    const context = getActionContextFromLocalStorage();
    const { api, scope } = context;
    const manager = api.internal.user;
    const user = (await manager.findMany({
        filter: {
            email: {
                equals: params.email
            }
        }
    }))[0];
    let result = false;
    if (user && params.password && user.password?.hash) {
        if (await context[kGlobals].platformModules.bcrypt().compare(params.password, user.password.hash)) {
            scope.authenticatedUser = user;
            result = true;
        }
    }
    context.logger.info({
        email: params.email,
        userId: user?.id,
        result
    }, "login attempt");
    if (!result) {
        throw new Error("Invalid email or password");
    }
}
/**
 * @private helper functions and variables
 */ export function doesVersionSupportSourceControl() {
    return Globals.platformModules.compareVersions().satisfies(frameworkVersion, ">=1.0.0");
}
/**
 * @private Get action context without `params` and `record` from async local storage.
 */ export function getActionContextFromLocalStorage() {
    return assert(actionContextLocalStorage.getStore(), "this effect function should only be called from within an action");
}
/**
 * @private Similar to `getActionContextFromLocalStorage` but returns `undefined` if there is no action context. (i.e. possibly called from a route)
 */ export function maybeGetActionContextFromLocalStorage() {
    return actionContextLocalStorage.getStore();
}
/**
 * Get the current ambient context in any context
 *
 * @returns The current ambient context, or `undefined` if there is no ambient context.
 * @private
 */ export function maybeGetCurrentContext() {
    return maybeGetActionContextFromLocalStorage() || Globals.requestContext.get("requestContext");
}
/**
 * Get the current ambient context in any context
 *
 * @returns The current ambient context, or throws if there is no ambient context.
 * @private
 */ export function getCurrentContext() {
    return assert(maybeGetCurrentContext(), "no gadget context found in AsyncLocalStorage or on request context");
}
export const LINK_PARAM = "_link";
export function writableAttributes(model, record) {
    const fieldsByApiIdentifier = Globals.platformModules.lodash().keyBy(Object.values(model.fields), "apiIdentifier");
    return Globals.platformModules.lodash().pickBy(record, (v, k)=>{
        const field = fieldsByApiIdentifier[k];
        if (!field) return false;
        const isRelationshipField = field.fieldType === "HasMany" || field.fieldType === "HasOne" || field.fieldType === "HasManyThrough";
        if (isRelationshipField && v === null) {
            return false;
        }
        return field.internalWritable;
    });
}
export function changedAttributes(model, record) {
    const changes = record.changes();
    const attributes = Object.keys(changes).reduce((attrs, key)=>{
        attrs[key] = record[key];
        return attrs;
    }, {});
    return writableAttributes(model, attributes);
}
export const getModelByApiIdentifier = (apiIdentifier)=>{
    const modelListIndexValue = maybeGetCurrentContext()?.[kGlobals]?.modelListIndex ?? modelListIndex;
    const typename = modelListIndexValue[`api:${apiIdentifier}`];
    if (!typename) {
        throw new InternalError(`Model ${apiIdentifier} not found in available model metadata`, {
            availableApiIdentifiers: Object.keys(modelListIndexValue)
        });
    }
    return getModelByTypename(typename);
};
export const getModelByTypename = (typename)=>{
    if (!typename) {
        throw new InternalError(`No typename found on record, __typename must be set for accessing model metadata`);
    }
    const modelsMapValue = maybeGetCurrentContext()?.[kGlobals]?.modelsMap ?? modelsMap;
    const model = modelsMapValue[typename];
    if (!model) {
        throw new InternalError(`Model with typename ${typename} not found in available model metadata`, {
            availableTypenames: Object.keys(modelsMapValue)
        });
    }
    return model;
};
export var FieldType = /*#__PURE__*/ function(FieldType) {
    FieldType["ID"] = "ID";
    FieldType["Number"] = "Number";
    FieldType["String"] = "String";
    FieldType["Enum"] = "Enum";
    FieldType["RichText"] = "RichText";
    FieldType["DateTime"] = "DateTime";
    FieldType["Email"] = "Email";
    FieldType["URL"] = "URL";
    FieldType["Money"] = "Money";
    FieldType["File"] = "File";
    FieldType["Color"] = "Color";
    FieldType["Password"] = "Password";
    FieldType["Computed"] = "Computed";
    FieldType["HasManyThrough"] = "HasManyThrough";
    FieldType["BelongsTo"] = "BelongsTo";
    FieldType["HasMany"] = "HasMany";
    FieldType["HasOne"] = "HasOne";
    FieldType["Boolean"] = "Boolean";
    FieldType["Model"] = "Model";
    FieldType["Object"] = "Object";
    FieldType["Array"] = "Array";
    FieldType["JSON"] = "JSON";
    FieldType["Code"] = "Code";
    FieldType["EncryptedString"] = "EncryptedString";
    FieldType["Vector"] = "Vector";
    /**
   * Any value at all.
   * Prefer FieldType.JSON where possible, it's more descriptive.
   */ FieldType["Any"] = "Any";
    FieldType["Null"] = "Null";
    FieldType["RecordState"] = "RecordState";
    FieldType["RoleAssignments"] = "RoleAssignments";
    return FieldType;
}({});
