import { IsNotEmpty, IsString } from 'class-validator';

export class CityCreateRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  countryName: string;
}
