"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAction = exports.getFeature = exports.Action = exports.Feature = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const Feature = (name) => common_1.SetMetadata(constants_1.FEAUTURE_NAME_METADATA, name);
exports.Feature = Feature;
const Action = (name) => common_1.SetMetadata(constants_1.ACTION_NAME_METADATA, name);
exports.Action = Action;
const getFeature = (target) => Reflect.getMetadata(constants_1.FEAUTURE_NAME_METADATA, target);
exports.getFeature = getFeature;
const getAction = (target) => Reflect.getMetadata(constants_1.ACTION_NAME_METADATA, target);
exports.getAction = getAction;
//# sourceMappingURL=feature-action.decorator.js.map