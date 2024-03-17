import { Expose, Type } from 'class-transformer';
import { EventCityVm } from './event-city.viewmodel';

export class EventVm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => EventCityVm)
  @Expose()
  city: EventCityVm;
}
