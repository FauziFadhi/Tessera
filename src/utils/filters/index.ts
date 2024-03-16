export * from './http.exception-filter';
export * from './base.exception-filter';

type MetaDTO = {
  url: string;
  method: string;
};

type Meta = {
  path: string;
  method: string;
  timestamp: string;
};

type responseBodyDTO = {
  meta: Meta;
  code: string;
  message: any;
};

export const meta = (request: MetaDTO): Meta => {
  return {
    path: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  };
};

export const responseBody = (data: responseBodyDTO) => {
  return {
    meta: data.meta,
    code: data.code,
    detail: data.message,
  };
};
