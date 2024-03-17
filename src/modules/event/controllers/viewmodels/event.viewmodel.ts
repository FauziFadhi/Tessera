import { Expose, Type } from 'class-transformer';
import { CityVm } from './city.viewmodel';

export class EventVm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => CityVm)
  @Expose()
  city: CityVm;
}
