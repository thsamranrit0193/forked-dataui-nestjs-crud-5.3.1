import { SCondition } from '@dataui/crud-request/lib/types/request-query.types';
import { ObjectLiteral } from '@dataui/crud-util';
import { ClassTransformOptions } from 'class-transformer';
export interface AuthGlobalOptions {
    property?: string;
    classTransformOptions?: (req: any) => ClassTransformOptions;
    groups?: (req: any) => string[];
}
export interface AuthOptions {
    property?: string;
    classTransformOptions?: (req: any) => ClassTransformOptions;
    groups?: (req: any) => string[];
    filter?: (req: any) => SCondition | void;
    or?: (req: any) => SCondition | void;
    persist?: (req: any) => ObjectLiteral;
}
