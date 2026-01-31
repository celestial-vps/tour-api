import { TransformationType, ClassTransformOptions } from 'class-transformer';
import { Types } from 'mongoose';
export declare const ObjectIdToString: ({ key, obj }: any) => any;
export declare const ObjectAny: ({ key, obj, value }: any) => any;
export declare const JsonStringifier: ({ key, obj, value }: any) => any;
export declare const JsonParser: ({ key, obj, value }: any) => any;
export declare const FloatToString: ({ key, obj }: any) => any;
export declare const FloatToNumber: ({ key, obj }: any) => any;
export declare const ToObjectId: ({ value }: any) => Types.ObjectId | Types.ObjectId[];
export declare const Decimal128ToFloat: ({ obj, key }: any) => any;
export declare function Default(defaultValue: unknown): PropertyDecorator;
export interface TransformMapperFn<T = any, V = any> {
    key: string;
    value: V;
    obj: T;
    type: TransformationType;
}
type ClassType<T> = new (...args: any[]) => T;
type MapperOpts = ClassTransformOptions;
export declare class Mapper {
    static mapTo<T, P = any>(dstClass: ClassType<T>, payload: P | P[], opts?: MapperOpts): T | T[];
    static mapToVM<T, P = any>(dstClass: ClassType<T>, payload: P | P[]): T | T[];
    static mapToDomain<T, P = any>(dstClass: ClassType<T>, payload: P | P[]): T | T[];
    static mapToModel<T, P = any>(dstClass: ClassType<T>, payload: P | P[]): T | T[];
    static deepClone<T>(data: T): T;
}
export {};
