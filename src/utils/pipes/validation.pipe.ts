import {
  flatten,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export const VALIDATION_CODE = 'V01';
@Injectable()
export class CustomValidationPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  createExceptionFactory(): (
    validationErrors?: ValidationError[] | undefined,
  ) => unknown {
    return (validationErrors = []) => {
      const mappedErrors = validationErrors?.map((error) => {
        if (error?.children?.length === 0 && error?.constraints) {
          return this.transformError(error);
        }

        if (error?.children?.[0]) {
          return this.getChildrenConstraint(error.children[0], error.property);
        }
        return null;
      });

      return new UnprocessableEntityException(
        flatten(mappedErrors),
        VALIDATION_CODE,
      );
    };
  }

  private getChildrenConstraint(children: any, parent?: string) {
    if (children.constraints) return this.transformError(children, parent);

    const grandChildren = children.children[0];
    return this.getChildrenConstraint(
      grandChildren,
      `${parent}.${children.property}`,
    );
  }

  private transformError(error, parent?: string) {
    const messages = Object.values(error.constraints);
    return messages.map((message) => ({
      field: parent ? `${parent}.${error.property}` : error.property,
      message,
    }));
  }
}
