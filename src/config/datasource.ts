import { City } from '@modules/city/entities/city.entity';
import { Event } from '@modules/event/entities/event.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateCityTable1710598371355 } from '@modules/city/db/migrations/1710598371355-create_city_table';
import { CreateEventTable1710656724153 } from '@modules/event/db/migrations/1710656724153-create_event_table';

export const options: DataSourceOptions = {
  type: 'sqlite',
  database: 'tessera.sqlite',
  entities: [City, Event],
  migrations: [CreateCityTable1710598371355, CreateEventTable1710656724153],
};

const datasource = new DataSource(options);
export default datasource;
