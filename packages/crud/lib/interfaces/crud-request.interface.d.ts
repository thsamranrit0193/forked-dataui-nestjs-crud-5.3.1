import { ParsedRequestParams } from '@dataui/crud-request';
import { CrudRequestOptions } from '../interfaces';
export interface CrudRequest<AUTH = {}, EXTRA = {}> {
    parsed: ParsedRequestParams<EXTRA>;
    options: CrudRequestOptions;
    auth?: AUTH;
}
