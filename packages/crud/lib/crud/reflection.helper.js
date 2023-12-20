"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R = void 0;
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const CONSTANTS = require("@nestjs/common/constants");
const crud_util_1 = require("@dataui/crud-util");
const constants_1 = require("../constants");
const { CUSTOM_ROUTE_AGRS_METADATA = CONSTANTS['CUSTOM_ROUTE_ARGS_METADATA'], INTERCEPTORS_METADATA, METHOD_METADATA, PARAMTYPES_METADATA, PATH_METADATA, ROUTE_ARGS_METADATA, } = CONSTANTS;
class R {
    static set(metadataKey, metadataValue, target, propertyKey = undefined) {
        if (propertyKey) {
            Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        else {
            Reflect.defineMetadata(metadataKey, metadataValue, target);
        }
    }
    static get(metadataKey, target, propertyKey = undefined) {
        return propertyKey
            ? Reflect.getMetadata(metadataKey, target, propertyKey)
            : Reflect.getMetadata(metadataKey, target);
    }
    static createCustomRouteArg(paramtype, index, pipes = [], data = undefined) {
        return {
            [`${paramtype}${CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
                index,
                factory: (_, ctx) => R.getContextRequest(ctx)[paramtype],
                data,
                pipes,
            },
        };
    }
    static createRouteArg(paramtype, index, pipes = [], data = undefined) {
        return {
            [`${paramtype}:${index}`]: {
                index,
                pipes,
                data,
            },
        };
    }
    static setDecorators(decorators, target, name) {
        const decoratedDescriptor = Reflect.decorate(decorators, target, name, Reflect.getOwnPropertyDescriptor(target, name));
        Reflect.defineProperty(target, name, decoratedDescriptor);
    }
    static setParsedRequestArg(index) {
        return R.createCustomRouteArg(constants_1.PARSED_CRUD_REQUEST_KEY, index);
    }
    static setBodyArg(index, pipes = []) {
        return R.createRouteArg(route_paramtypes_enum_1.RouteParamtypes.BODY, index, pipes);
    }
    static setCrudOptions(options, target) {
        R.set(constants_1.CRUD_OPTIONS_METADATA, options, target);
    }
    static setRoute(route, func) {
        R.set(PATH_METADATA, route.path, func);
        R.set(METHOD_METADATA, route.method, func);
    }
    static setInterceptors(interceptors, func) {
        R.set(INTERCEPTORS_METADATA, interceptors, func);
    }
    static setRouteArgs(metadata, target, name) {
        R.set(ROUTE_ARGS_METADATA, metadata, target, name);
    }
    static setRouteArgsTypes(metadata, target, name) {
        R.set(PARAMTYPES_METADATA, metadata, target, name);
    }
    static setAction(action, func) {
        R.set(constants_1.ACTION_NAME_METADATA, action, func);
    }
    static setCrudAuthOptions(metadata, target) {
        R.set(constants_1.CRUD_AUTH_OPTIONS_METADATA, metadata, target);
    }
    static getCrudAuthOptions(target) {
        return R.get(constants_1.CRUD_AUTH_OPTIONS_METADATA, target);
    }
    static getCrudOptions(target) {
        return R.get(constants_1.CRUD_OPTIONS_METADATA, target);
    }
    static getAction(func) {
        return R.get(constants_1.ACTION_NAME_METADATA, func);
    }
    static getFeature(target) {
        return R.get(constants_1.FEAUTURE_NAME_METADATA, target);
    }
    static getOverrideRoute(func) {
        return R.get(constants_1.OVERRIDE_METHOD_METADATA, func);
    }
    static getInterceptors(func) {
        return R.get(INTERCEPTORS_METADATA, func) || [];
    }
    static getRouteArgs(target, name) {
        return R.get(ROUTE_ARGS_METADATA, target, name);
    }
    static getRouteArgsTypes(target, name) {
        return R.get(PARAMTYPES_METADATA, target, name) || [];
    }
    static getParsedBody(func) {
        return R.get(constants_1.PARSED_BODY_METADATA, func);
    }
    static getContextRequest(ctx) {
        return crud_util_1.isFunction(ctx.switchToHttp)
            ? ctx.switchToHttp().getRequest()
            : ctx;
    }
}
exports.R = R;
//# sourceMappingURL=reflection.helper.js.map