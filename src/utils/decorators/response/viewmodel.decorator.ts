import { Transform } from 'class-transformer';

export function Default(defaultValue: unknown): PropertyDecorator {
  return Transform((obj: any) => obj?.value ?? defaultValue);
}
