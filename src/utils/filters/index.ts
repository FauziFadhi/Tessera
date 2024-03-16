export * from './http.exception-filter';
export * from './base.exception-filter';
export * from './typeorm.exception-filter';

type MetaDTO = {
  url: string;
  method: string;
};

type responseBodyDTO = MetaDTO & {
  code: string;
  message: any;
};

const meta = (request: MetaDTO) => {
  return {
    path: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  };
};

export const responseBody = (data: responseBodyDTO) => {
  return {
    meta: meta(data),
    code: data.code,
    detail: data.message,
  };
};
