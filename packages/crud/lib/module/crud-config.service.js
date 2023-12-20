"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudConfigService = void 0;
const crud_request_1 = require("@dataui/crud-request");
const crud_util_1 = require("@dataui/crud-util");
const deepmerge = require("deepmerge");
class CrudConfigService {
    static load(config = {}) {
        const auth = crud_util_1.isObjectFull(config.auth) ? config.auth : {};
        const query = crud_util_1.isObjectFull(config.query) ? config.query : {};
        const routes = crud_util_1.isObjectFull(config.routes) ? config.routes : {};
        const operators = crud_util_1.isObjectFull(config.operators) ? config.operators : {};
        const params = crud_util_1.isObjectFull(config.params) ? config.params : {};
        const serialize = crud_util_1.isObjectFull(config.serialize) ? config.serialize : {};
        if (crud_util_1.isObjectFull(config.queryParser)) {
            crud_request_1.RequestQueryBuilder.setOptions({ ...config.queryParser });
        }
        CrudConfigService.config = deepmerge(CrudConfigService.config, { auth, query, routes, operators, params, serialize }, { arrayMerge: (a, b, c) => b });
    }
}
exports.CrudConfigService = CrudConfigService;
CrudConfigService.config = {
    auth: {},
    query: {
        alwaysPaginate: false,
    },
    operators: {},
    routes: {
        getManyBase: { interceptors: [], decorators: [] },
        getOneBase: { interceptors: [], decorators: [] },
        createOneBase: { interceptors: [], decorators: [], returnShallow: false },
        createManyBase: { interceptors: [], decorators: [] },
        updateOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: false,
            returnShallow: false,
        },
        replaceOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: false,
            returnShallow: false,
        },
        deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
        recoverOneBase: { interceptors: [], decorators: [], returnRecovered: false },
    },
    params: {},
};
//# sourceMappingURL=crud-config.service.js.map