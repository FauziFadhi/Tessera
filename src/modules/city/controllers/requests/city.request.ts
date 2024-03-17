import { IsNotEmpty, IsString } from 'class-validator';

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
