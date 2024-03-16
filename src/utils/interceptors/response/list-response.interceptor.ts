import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
type Meta = {
  currentRecordCount: number;
  totalRecordCount: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  startOf: number;
  [key: string]: unknown;
};

@Injectable()
export class ResponsePaginationInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((response) => {
        const request: Request<
          unknown,
          unknown,
          unknown,
          {
            page: string;
            size: string;
          }
        > = context.switchToHttp().getRequest();

        if (!response?.rows) {
          return {
            data: [],
            meta: {},
          };
        }

        const meta = this.meta(
          {
            count: response.count,
            rowsLength: response.rows.length,
            meta: response.meta,
          },
          request.query,
        );

        // const reply: FastifyReply = context.switchToHttp().getResponse();
        return {
          data: response.rows,
          meta,
          // links: this.links(
          //   { currentPage: +meta.currentPage, totalPage: +meta.totalPage },
          //   request.query,
          //   reply,
          // ),
        };
      }),
    );
  }

  // private links(
  //   { currentPage, totalPage },
  //   query: { page: string; size: string },
  //   reply: Response,
  // ) {
  //   const pathname = reply.;

  //   const self = () => this.linkQueries(currentPage, pathname);
  //   const prev = () => {
  //     const prevPage = currentPage - 1;
  //     if (prevPage < 1 || currentPage >= totalPage) return undefined;

  //     return this.linkQueries(prevPage, pathname);
  //   };
  //   const next = () => {
  //     if (currentPage >= totalPage) return undefined;

  //     return this.linkQueries(currentPage + 1, pathname);
  //   };
  //   const last = () => {
  //     if (!totalPage) return undefined;
  //     return this.linkQueries(totalPage, pathname);
  //   };

  //   return {
  //     self: self(),
  //     prev: prev(),
  //     next: next(),
  //     last: last(),
  //   };
  // }

  private linkQueries(page: number, pathname: string): string {
    return pathname.replace(/page=[0-9]*/, `page=${page}`);
  }

  /**
   * @param {Object} args - The arguments for generating the meta data.
   *   - {number | unknown[]} count - The count of records or an array of unknown values.
   *   - {Record<string, unknown>} [meta] - Additional meta data.
   *   - {number} rowsLength - The length of the rows.
   * @param {Object} options - The options for generating the meta data.
   *   - {number} size - The size of the page.
   *   - {number} page - The current page number.
   * @return {Meta} The generated meta data.
   */
  private meta(
    args: {
      count: number | unknown[];
      meta?: Record<string, unknown>;
      rowsLength: number;
    },
    { size, page },
  ): Meta {
    // META
    const total: number =
      typeof args.count === 'object' ? args.count?.length || 0 : args.count;

    const totalPage = size ? Math.ceil(total / size) : 0;

    const offset = size && page ? size * page - +size : 0;

    return {
      totalRecordCount: total,
      currentRecordCount: args?.rowsLength || 0,
      totalPage: totalPage || 0,
      currentPage: +(args?.meta?.page || page || 1),
      perPage: +(size || 0),
      startOf: (args.count && offset + 1) || 0,
      ...args.meta,
    };
  }
}
