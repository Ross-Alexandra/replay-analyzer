import * as _api from './api-functions';
import type { ApiFunction } from './api-functions/type';

export const api = (_api as unknown) as Record<string, ApiFunction<unknown[], unknown>>;