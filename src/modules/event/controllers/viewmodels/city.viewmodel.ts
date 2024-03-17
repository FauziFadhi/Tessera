import { Expose } from 'class-transformer';

export class CityVm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  countryName: string;
}
