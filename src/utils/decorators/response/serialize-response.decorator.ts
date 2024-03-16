import { UseInterceptors, applyDecorators } from '@nestjs/common';
import {
  ResponseInterceptor,
  ResponsePaginationInterceptor,
} from '@utils/interceptors';

export function SerializeResponse(type: 'pagination' | 'simple' = 'simple') {
  return applyDecorators(
    type === 'pagination'
      ? UseInterceptors(ResponsePaginationInterceptor)
      : UseInterceptors(ResponseInterceptor),
  );
}
