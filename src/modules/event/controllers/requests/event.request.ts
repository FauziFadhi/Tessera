import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EventCreateRequest {
  /**
   * name of the event
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * city id of the event
   */
  @IsString()
  @IsNotEmpty({ message: 'city must be provided' })
  cityId: string;
}

export class EventGetQuery {
  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
