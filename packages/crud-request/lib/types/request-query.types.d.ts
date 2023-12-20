export declare type QueryFields = string[];
export interface QueryFilter {
    field: string;
    operator: ComparisonOperator;
    value?: any;
}
export declare type QueryFilterArr = [string, ComparisonOperator, any?];
export interface QueryJoin {
    field: string;
    select?: QueryFields;
}
export declare type QueryJoinArr = [string, QueryFields?];
export interface QuerySort {
    field: string;
    order: QuerySortOperator;
}
export declare type QueryExtra = any | undefined;
export declare type QuerySortArr = [string, QuerySortOperator];
export declare type QuerySortOperator = 'ASC' | 'DESC';
declare type DeprecatedCondOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'starts' | 'ends' | 'cont' | 'excl' | 'in' | 'notin' | 'isnull' | 'notnull' | 'between' | 'contArr' | 'intersectsArr';
export declare enum CondOperator {
    EQUALS = "$eq",
    NOT_EQUALS = "$ne",
    GREATER_THAN = "$gt",
    LOWER_THAN = "$lt",
    GREATER_THAN_EQUALS = "$gte",
    LOWER_THAN_EQUALS = "$lte",
    STARTS = "$starts",
    ENDS = "$ends",
    CONTAINS = "$cont",
    EXCLUDES = "$excl",
    IN = "$in",
    NOT_IN = "$notin",
    IS_NULL = "$isnull",
    NOT_NULL = "$notnull",
    BETWEEN = "$between",
    EQUALS_LOW = "$eqL",
    NOT_EQUALS_LOW = "$neL",
    STARTS_LOW = "$startsL",
    ENDS_LOW = "$endsL",
    CONTAINS_LOW = "$contL",
    EXCLUDES_LOW = "$exclL",
    IN_LOW = "$inL",
    NOT_IN_LOW = "$notinL",
    CONTAINS_ARRAY = "$contArr",
    INTERSECTS_ARRAY = "$intersectsArr"
}
export declare type ComparisonOperator = DeprecatedCondOperator | keyof SFieldOperator | string;
export declare type SPrimitivesVal = string | number | boolean;
export declare type SFieldValues = SPrimitivesVal | Array<SPrimitivesVal>;
export declare type SFiledValues = SFieldValues;
export interface SFieldOperator {
    $eq?: SFieldValues;
    $ne?: SFieldValues;
    $gt?: SFieldValues;
    $lt?: SFieldValues;
    $gte?: SFieldValues;
    $lte?: SFieldValues;
    $starts?: SFieldValues;
    $ends?: SFieldValues;
    $cont?: SFieldValues;
    $excl?: SFieldValues;
    $in?: SFieldValues;
    $notin?: SFieldValues;
    $between?: SFieldValues;
    $isnull?: SFieldValues;
    $notnull?: SFieldValues;
    $eqL?: SFieldValues;
    $neL?: SFieldValues;
    $startsL?: SFieldValues;
    $endsL?: SFieldValues;
    $contL?: SFieldValues;
    $exclL?: SFieldValues;
    $inL?: SFieldValues;
    $notinL?: SFieldValues;
    $contArr?: Array<SPrimitivesVal>;
    $intersectsArr?: Array<SPrimitivesVal>;
    $or?: SFieldOperator;
    $and?: never;
    $not?: never;
}
export declare type SField = SPrimitivesVal | SFieldOperator | {
    [$custom: string]: SFieldValues;
};
export interface SFields {
    [key: string]: SField | Array<SFields | SConditionAND | SConditionNOT> | undefined;
    $or?: Array<SFields | SConditionAND | SConditionNOT>;
    $and?: never;
    $not?: never;
}
export interface SConditionAND {
    $and?: Array<SFields | SConditionAND | SConditionNOT>;
    $or?: never;
    $not?: never;
}
export interface SConditionNOT {
    $and?: never;
    $or?: never;
    $not: Array<SFields | SConditionAND | SConditionNOT>;
}
export declare type SConditionKey = '$and' | '$or' | '$not';
export declare type SCondition = SFields | SConditionAND | SConditionNOT;
export {};
