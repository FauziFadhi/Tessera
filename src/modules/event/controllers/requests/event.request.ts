import { IsNotEmpty, IsString } from 'class-validator';

export class EventCreateRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'city must be provided' })
  cityId: string;
}
