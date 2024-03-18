import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CityCreateRequest {
  /**
   * name of the city
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * country name of the city
   */
  @IsString()
  @IsNotEmpty()
  countryName: string;
}
export class CityGetQuery {
  @IsString()
  @IsOptional()
  countryName?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
