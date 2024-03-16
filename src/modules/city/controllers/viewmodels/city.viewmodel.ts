import { Expose } from 'class-transformer';

export class CityVm {
  @Expose()
  id: string;
  ring;
  @Expose()
  name: string;

  @Expose()
  countryName: string;
}
