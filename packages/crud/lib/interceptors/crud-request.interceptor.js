"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudRequestInterceptor = void 0;
const common_1 = require("@nestjs/common");
const crud_request_1 = require("@dataui/crud-request");
const crud_util_1 = require("@dataui/crud-util");
const constants_1 = require("../constants");
const enums_1 = require("../enums");
const crud_base_interceptor_1 = require("./crud-base.interceptor");
let CrudRequestInterceptor = class CrudRequestInterceptor extends crud_base_interceptor_1.CrudBaseInterceptor {
    intercept(context, next) {
        var _a;
        const req = context.switchToHttp().getRequest();
        try {
            if (!req[constants_1.PARSED_CRUD_REQUEST_KEY]) {
                const { ctrlOptions, crudOptions, action } = this.getCrudInfo(context);
                const parser = crud_request_1.RequestQueryParser.create();
                parser.parseQuery(req.query, (_a = crudOptions.operators) === null || _a === void 0 ? void 0 : _a.custom);
                let auth = null;
                if (!crud_util_1.isNil(ctrlOptions)) {
                    const search = this.getSearch(parser, crudOptions, action, req.params);
                    auth = this.getAuth(parser, crudOptions, req);
                    parser.search = auth.or
                        ? { $or: [auth.or, { $and: search }] }
                        : { $and: [auth.filter, ...search] };
                }
                else {
                    parser.search = { $and: this.getSearch(parser, crudOptions, action) };
                }
                req[constants_1.PARSED_CRUD_REQUEST_KEY] = this.getCrudRequest(parser, crudOptions, auth === null || auth === void 0 ? void 0 : auth.auth);
            }
            return next.handle();
        }
        catch (error) {
            throw error instanceof crud_request_1.RequestQueryException
                ? new common_1.BadRequestException(error.message)
                : error;
        }
    }
    getCrudRequest(parser, crudOptions, auth) {
        const parsed = parser.getParsed();
        const { query, routes, params, operators } = crudOptions;
        return {
            parsed,
            options: {
                query,
                routes,
                params,
                operators,
            },
            auth,
        };
    }
    getSearch(parser, crudOptions, action, params) {
        const paramsSearch = this.getParamsSearch(parser, crudOptions, params);
        if (crud_util_1.isFunction(crudOptions.query.filter)) {
            const filterCond = crudOptions.query.filter(parser.search, action === enums_1.CrudActions.ReadAll) || {};
            return [...paramsSearch, filterCond];
        }
        const optionsFilter = crud_util_1.isArrayFull(crudOptions.query.filter)
            ? crudOptions.query.filter.map(parser.convertFilterToSearch)
            : [crudOptions.query.filter || {}];
        let search = [];
        if (parser.search) {
            search = [parser.search];
        }
        else if (crud_util_1.hasLength(parser.filter) && crud_util_1.hasLength(parser.or)) {
            search =
                parser.filter.length === 1 && parser.or.length === 1
                    ? [
                        {
                            $or: [
                                parser.convertFilterToSearch(parser.filter[0]),
                                parser.convertFilterToSearch(parser.or[0]),
                            ],
                        },
                    ]
                    : [
                        {
                            $or: [
                                { $and: parser.filter.map(parser.convertFilterToSearch) },
                                { $and: parser.or.map(parser.convertFilterToSearch) },
                            ],
                        },
                    ];
        }
        else if (crud_util_1.hasLength(parser.filter)) {
            search = parser.filter.map(parser.convertFilterToSearch);
        }
        else {
            if (crud_util_1.hasLength(parser.or)) {
                search =
                    parser.or.length === 1
                        ? [parser.convertFilterToSearch(parser.or[0])]
                        : [
                            {
                                $or: parser.or.map(parser.convertFilterToSearch),
                            },
                        ];
            }
        }
        return [...paramsSearch, ...optionsFilter, ...search];
    }
    getParamsSearch(parser, crudOptions, params) {
        if (params) {
            parser.parseParams(params, crudOptions.params);
            return crud_util_1.isArrayFull(parser.paramsFilter)
                ? parser.paramsFilter.map(parser.convertFilterToSearch)
                : [];
        }
        return [];
    }
    getAuth(parser, crudOptions, req) {
        const auth = {};
        if (crudOptions.auth) {
            const userOrRequest = crudOptions.auth.property
                ? req[crudOptions.auth.property]
                : req;
            if (crudOptions.auth.property && req[crudOptions.auth.property]) {
                if (typeof req[crudOptions.auth.property] === 'object') {
                    if (Object.keys(req[crudOptions.auth.property]).length > 0) {
                        auth.auth = req[crudOptions.auth.property];
                    }
                }
                else {
                    auth.auth = req[crudOptions.auth.property];
                }
            }
            if (crud_util_1.isFunction(crudOptions.auth.or)) {
                auth.or = crudOptions.auth.or(userOrRequest);
            }
            if (crud_util_1.isFunction(crudOptions.auth.filter) && !auth.or) {
                auth.filter =
                    crudOptions.auth.filter(userOrRequest) || {};
            }
            if (crud_util_1.isFunction(crudOptions.auth.persist)) {
                parser.setAuthPersist(crudOptions.auth.persist(userOrRequest));
            }
            const options = {};
            if (crud_util_1.isFunction(crudOptions.auth.classTransformOptions)) {
                Object.assign(options, crudOptions.auth.classTransformOptions(userOrRequest));
            }
            if (crud_util_1.isFunction(crudOptions.auth.groups)) {
                options.groups = crudOptions.auth.groups(userOrRequest);
            }
            parser.setClassTransformOptions(options);
        }
        return auth;
    }
};
CrudRequestInterceptor = __decorate([
    common_1.Injectable()
], CrudRequestInterceptor);
exports.CrudRequestInterceptor = CrudRequestInterceptor;
//# sourceMappingURL=crud-request.interceptor.js.map