import { IsGreaterThan, IsLessThan } from '@utils/decorators/validation';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

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

  /**
   * price of the event in USD
   */
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'price must be greater than 0' })
  price: number;
}

export class EventGetQuery {
  @IsString()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsGreaterThan('minPrice')
  @IsPositive({ message: 'price must be greater than 0' })
  maxPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsLessThan('maxPrice')
  @IsPositive({ message: 'price must be greater than 0' })
  minPrice?: number;
}
