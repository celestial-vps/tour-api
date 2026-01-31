"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapper = exports.Decimal128ToFloat = exports.ToObjectId = exports.FloatToNumber = exports.FloatToString = exports.JsonParser = exports.JsonStringifier = exports.ObjectAny = exports.ObjectIdToString = void 0;
exports.Default = Default;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const ObjectIdToString = ({ key, obj }) => {
    const val = obj[key];
    return val instanceof mongoose_1.Types.ObjectId ? val.toHexString() : val;
};
exports.ObjectIdToString = ObjectIdToString;
const ObjectAny = ({ key, obj, value }) => (obj ? obj[key] : value);
exports.ObjectAny = ObjectAny;
const JsonStringifier = ({ key, obj, value }) => {
    const src = obj[key];
    if (value && typeof value === 'object') {
        return Object.keys(value).length > 0 ? JSON.stringify(value) : JSON.stringify(src);
    }
    return value ?? (typeof src !== 'undefined' ? JSON.stringify(src) : src);
};
exports.JsonStringifier = JsonStringifier;
const JsonParser = ({ key, obj, value }) => {
    const newValue = (0, exports.ObjectAny)({ key, obj, value });
    if (newValue && typeof newValue === 'string') {
        try {
            return JSON.parse(newValue);
        }
        catch {
            return newValue;
        }
    }
    return newValue;
};
exports.JsonParser = JsonParser;
const FloatToString = ({ key, obj }) => {
    const val = obj[key];
    return val instanceof mongoose_1.Types.Decimal128 ? val.toString() : val;
};
exports.FloatToString = FloatToString;
const FloatToNumber = ({ key, obj }) => {
    const val = obj[key];
    return val instanceof mongoose_1.Types.Decimal128 ? +val.toString() : val;
};
exports.FloatToNumber = FloatToNumber;
const ToObjectId = ({ value }) => {
    if (Array.isArray(value)) {
        return value.map(v => (v instanceof mongoose_1.Types.ObjectId ? v : new mongoose_1.Types.ObjectId(v)));
    }
    return value instanceof mongoose_1.Types.ObjectId ? value : new mongoose_1.Types.ObjectId(value);
};
exports.ToObjectId = ToObjectId;
const Decimal128ToFloat = ({ obj, key }) => {
    const value = obj[key];
    return value instanceof mongoose_1.Types.Decimal128 ? parseFloat(value.toString()) : value;
};
exports.Decimal128ToFloat = Decimal128ToFloat;
function Default(defaultValue) {
    return (0, class_transformer_1.Transform)(({ value }) => value ?? Mapper.deepClone(defaultValue));
}
class Mapper {
    static mapTo(dstClass, payload, opts) {
        return (0, class_transformer_1.plainToInstance)(dstClass, payload, opts);
    }
    static mapToVM(dstClass, payload) {
        return this.mapTo(dstClass, payload, {
            strategy: 'excludeAll'
        });
    }
    static mapToDomain(dstClass, payload) {
        return this.mapTo(dstClass, payload, {
            strategy: 'excludeAll'
        });
    }
    static mapToModel(dstClass, payload) {
        return this.mapTo(dstClass, payload, {
            strategy: 'excludeAll'
        });
    }
    static deepClone(data) {
        return (0, class_transformer_1.instanceToInstance)(data);
    }
}
exports.Mapper = Mapper;
//# sourceMappingURL=mapper.js.map