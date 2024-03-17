import { Expose } from 'class-transformer';

export class EventCityVm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  countryName: string;
}
