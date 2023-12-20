"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestQueryParser = void 0;
const crud_util_1 = require("@dataui/crud-util");
const exceptions_1 = require("./exceptions");
const request_query_builder_1 = require("./request-query.builder");
const request_query_validator_1 = require("./request-query.validator");
class RequestQueryParser {
    constructor() {
        this.fields = [];
        this.paramsFilter = [];
        this.authPersist = undefined;
        this.classTransformOptions = undefined;
        this.filter = [];
        this.or = [];
        this.join = [];
        this.sort = [];
    }
    get _options() {
        return request_query_builder_1.RequestQueryBuilder.getOptions();
    }
    static create() {
        return new RequestQueryParser();
    }
    getParsed() {
        return {
            fields: this.fields,
            paramsFilter: this.paramsFilter,
            authPersist: this.authPersist,
            classTransformOptions: this.classTransformOptions,
            search: this.search,
            filter: this.filter,
            or: this.or,
            join: this.join,
            sort: this.sort,
            limit: this.limit,
            offset: this.offset,
            page: this.page,
            cache: this.cache,
            includeDeleted: this.includeDeleted,
            extra: this.extra,
        };
    }
    parseQuery(query, customOperators = {}) {
        if (crud_util_1.isObject(query)) {
            const paramNames = crud_util_1.objKeys(query);
            if (crud_util_1.hasLength(paramNames)) {
                this._query = query;
                this._paramNames = paramNames;
                const searchData = this._query[this.getParamNames('search')[0]];
                this.search = this.parseSearchQueryParam(searchData);
                if (crud_util_1.isNil(this.search)) {
                    this.filter = this.parseQueryParam('filter', this.conditionParser.bind(this, 'filter', customOperators));
                    this.or = this.parseQueryParam('or', this.conditionParser.bind(this, 'or', customOperators));
                }
                this.fields =
                    this.parseQueryParam('fields', this.fieldsParser.bind(this))[0] || [];
                this.join = this.parseQueryParam('join', this.joinParser.bind(this));
                this.sort = this.parseQueryParam('sort', this.sortParser.bind(this));
                this.limit = this.parseQueryParam('limit', this.numericParser.bind(this, 'limit'))[0];
                this.offset = this.parseQueryParam('offset', this.numericParser.bind(this, 'offset'))[0];
                this.page = this.parseQueryParam('page', this.numericParser.bind(this, 'page'))[0];
                this.cache = this.parseQueryParam('cache', this.numericParser.bind(this, 'cache'))[0];
                this.includeDeleted = this.parseQueryParam('includeDeleted', this.numericParser.bind(this, 'includeDeleted'))[0];
                this.extra = this.parseExtraFromQueryParam();
            }
        }
        return this;
    }
    parseParams(params, options) {
        if (crud_util_1.isObject(params)) {
            const paramNames = crud_util_1.objKeys(params);
            if (crud_util_1.hasLength(paramNames)) {
                this._params = params;
                this._paramsOptions = options;
                this.paramsFilter = paramNames
                    .map((name) => this.paramParser(name))
                    .filter((filter) => filter);
            }
        }
        return this;
    }
    setAuthPersist(persist = {}) {
        this.authPersist = persist || {};
    }
    setClassTransformOptions(options = {}) {
        this.classTransformOptions = options || {};
    }
    convertFilterToSearch(filter) {
        const isEmptyValue = {
            isnull: true,
            notnull: true,
        };
        return filter
            ? {
                [filter.field]: {
                    [filter.operator]: isEmptyValue[filter.operator]
                        ? isEmptyValue[filter.operator]
                        : filter.value,
                },
            }
            : {};
    }
    getParamNames(type) {
        return this._paramNames.filter((p) => {
            const name = this._options.paramNamesMap[type];
            return crud_util_1.isString(name) ? name === p : name.some((m) => m === p);
        });
    }
    getParamValues(value, parser) {
        if (crud_util_1.isStringFull(value)) {
            return [parser.call(this, value)];
        }
        if (crud_util_1.isArrayFull(value)) {
            return value.map((val) => parser(val));
        }
        return [];
    }
    parseQueryParam(type, parser) {
        const param = this.getParamNames(type);
        if (crud_util_1.isArrayFull(param)) {
            return param.reduce((a, name) => [...a, ...this.getParamValues(this._query[name], parser)], []);
        }
        return [];
    }
    parseExtraFromQueryParam() {
        const params = Array.isArray(this._options.paramNamesMap.extra)
            ? this._options.paramNamesMap.extra
            : [this._options.paramNamesMap.extra];
        const extraKeys = Object.keys(this._query || {})
            .filter((k) => params.find((p) => k === null || k === void 0 ? void 0 : k.startsWith(p)))
            .reduce((o, k) => {
            const key = k.replace('extra.', '');
            this.parseDotChainToObject(this._query[k], key, o);
            return o;
        }, {});
        return Object.keys(extraKeys).length > 0 ? extraKeys : undefined;
    }
    parseDotChainToObject(data, key, result = {}) {
        if (key.includes('.')) {
            const keys = key.split('.');
            const firstKey = keys.shift();
            result[firstKey] = {};
            this.parseDotChainToObject(data, keys.join('.'), result[firstKey]);
        }
        else {
            result[key] = this.parseValue(data);
        }
    }
    parseValue(val) {
        try {
            const parsed = JSON.parse(val);
            if (!crud_util_1.isDate(parsed) && crud_util_1.isObject(parsed)) {
                return val;
            }
            else if (typeof parsed === 'number' &&
                parsed.toLocaleString('fullwide', { useGrouping: false }) !== val) {
                return val;
            }
            return parsed;
        }
        catch (ignored) {
            if (crud_util_1.isDateString(val)) {
                return new Date(val);
            }
            return val;
        }
    }
    parseValues(vals) {
        if (crud_util_1.isArrayFull(vals)) {
            return vals.map((v) => this.parseValue(v));
        }
        else {
            return this.parseValue(vals);
        }
    }
    fieldsParser(data) {
        return data.split(this._options.delimStr);
    }
    parseSearchQueryParam(d) {
        try {
            if (crud_util_1.isNil(d)) {
                return undefined;
            }
            const data = JSON.parse(d);
            if (!crud_util_1.isObject(data)) {
                throw new Error();
            }
            return data;
        }
        catch (_) {
            throw new exceptions_1.RequestQueryException('Invalid search param. JSON expected');
        }
    }
    conditionParser(cond, customOperators, data) {
        const isArrayValue = [
            'in',
            'notin',
            'between',
            '$in',
            '$notin',
            '$between',
            '$inL',
            '$notinL',
            '$contArr',
            '$intersectsArr',
        ].concat(Object.keys(customOperators).filter((op) => customOperators[op].isArray));
        const isEmptyValue = ['isnull', 'notnull', '$isnull', '$notnull'];
        const param = data.split(this._options.delim);
        const field = param[0];
        const operator = param[1];
        let value = param[2] || '';
        if (isArrayValue.some((name) => name === operator)) {
            value = value.split(this._options.delimStr);
        }
        value = this.parseValues(value);
        if (!isEmptyValue.some((name) => name === operator) && !crud_util_1.hasValue(value)) {
            throw new exceptions_1.RequestQueryException(`Invalid ${cond} value`);
        }
        const condition = { field, operator, value };
        request_query_validator_1.validateCondition(condition, cond, customOperators);
        return condition;
    }
    joinParser(data) {
        const param = data.split(this._options.delim);
        const join = {
            field: param[0],
            select: crud_util_1.isStringFull(param[1]) ? param[1].split(this._options.delimStr) : undefined,
        };
        request_query_validator_1.validateJoin(join);
        return join;
    }
    sortParser(data) {
        const param = data.split(this._options.delimStr);
        const sort = {
            field: param[0],
            order: param[1],
        };
        request_query_validator_1.validateSort(sort);
        return sort;
    }
    numericParser(num, data) {
        const val = this.parseValue(data);
        request_query_validator_1.validateNumeric(val, num);
        return val;
    }
    paramParser(name) {
        request_query_validator_1.validateParamOption(this._paramsOptions, name);
        const option = this._paramsOptions[name];
        if (option.disabled) {
            return undefined;
        }
        let value = this._params[name];
        switch (option.type) {
            case 'number':
                value = this.parseValue(value);
                request_query_validator_1.validateNumeric(value, `param ${name}`);
                break;
            case 'uuid':
                request_query_validator_1.validateUUID(value, name);
                break;
            default:
                break;
        }
        return { field: option.field, operator: '$eq', value };
    }
}
exports.RequestQueryParser = RequestQueryParser;
//# sourceMappingURL=request-query.parser.js.map