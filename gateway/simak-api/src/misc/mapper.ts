/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    plainToInstance,
    Transform,
    TransformationType,
    instanceToInstance,
    ClassTransformOptions
} from 'class-transformer';
import { Types } from 'mongoose';

/* -----------------------------------------------------
 *  TRANSFORM HELPERS
 * ----------------------------------------------------- */

// Convert ObjectId → string
export const ObjectIdToString = ({ key, obj }: any) => {
    const val = obj[key];
    return val instanceof Types.ObjectId ? val.toHexString() : val;
};

// Safe any object return
export const ObjectAny = ({ key, obj, value }: any) => (obj ? obj[key] : value);

// Convert nested object → JSON string
export const JsonStringifier = ({ key, obj, value }: any) => {
    const src = obj[key];

    if (value && typeof value === 'object') {
        return Object.keys(value).length > 0 ? JSON.stringify(value) : JSON.stringify(src);
    }
    return value ?? (typeof src !== 'undefined' ? JSON.stringify(src) : src);
};

// Parse JSON string → object
export const JsonParser = ({ key, obj, value }: any) => {
    const newValue = ObjectAny({ key, obj, value });

    if (newValue && typeof newValue === 'string') {
        try {
            return JSON.parse(newValue);
        } catch {
            return newValue;
        }
    }
    return newValue;
};

// Decimal128 → string
export const FloatToString = ({ key, obj }: any) => {
    const val = obj[key];
    return val instanceof Types.Decimal128 ? val.toString() : val;
};

// Decimal128 → number
export const FloatToNumber = ({ key, obj }: any) => {
    const val = obj[key];
    return val instanceof Types.Decimal128 ? +val.toString() : val;
};

// Convert string → ObjectId (optional)
export const ToObjectId = ({ value }: any) => {
    if (Array.isArray(value)) {
        return value.map(v => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v)));
    }
    return value instanceof Types.ObjectId ? value : new Types.ObjectId(value);
};

// Convert Decimal128 → float number
export const Decimal128ToFloat = ({ obj, key }: any) => {
    const value = obj[key];
    return value instanceof Types.Decimal128 ? parseFloat(value.toString()) : value;
};

// Default value decorator
export function Default(defaultValue: unknown): PropertyDecorator {
    return Transform(({ value }) => value ?? Mapper.deepClone(defaultValue));
}

/* -----------------------------------------------------
 *  TYPES
 * ----------------------------------------------------- */

export interface TransformMapperFn<T = any, V = any> {
    key: string;
    value: V;
    obj: T;
    type: TransformationType;
}

type ClassType<T> = new (...args: any[]) => T;
type MapperOpts = ClassTransformOptions;

/* -----------------------------------------------------
 *  MAPPER CLASS - CORE
 * ----------------------------------------------------- */

export class Mapper {
    /**
     * General mapping function
     */
    static mapTo<T, P = any>(
        dstClass: ClassType<T>,
        payload: P | P[],
        opts?: MapperOpts
    ): T | T[] {
        return plainToInstance(dstClass, payload as any, opts);
    }

    /**
     * Map to ViewModel (VM)
     */
    static mapToVM<T, P = any>(
        dstClass: ClassType<T>,
        payload: P | P[]
    ): T | T[] {
        return this.mapTo(dstClass, payload, {
            strategy: 'excludeAll'
        });
    }

    /**
     * Map to Domain Model
     */
    static mapToDomain<T, P = any>(
        dstClass: ClassType<T>,
        payload: P | P[]
    ): T | T[] {
        return this.mapTo(dstClass, payload, {
            strategy: 'excludeAll'
        });
    }

    /**
     * Map to Database Model
     */
    static mapToModel<T, P = any>(
        dstClass: ClassType<T>,
        payload: P | P[]
    ): T | T[] {
        return this.mapTo(dstClass, payload, {
            strategy: 'excludeAll'
        });
    }

    /**
     * Deep clone object
     */
    static deepClone<T>(data: T): T {
        return instanceToInstance(data);
    }
}
