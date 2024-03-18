import { City } from '@modules/city/entities/city.entity';
import { Event } from '@modules/event/entities/event.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateCityTable1710598371355 } from '@modules/city/db/migrations/1710598371355-create_city_table';
import { CreateEventTable1710656724153 } from '@modules/event/db/migrations/1710656724153-create_event_table';
import { AddUniqueNameEventTable1710776435330 } from '@modules/event/db/migrations/1710776435330-add_unique_name_event_table';

export const options: DataSourceOptions = {
  type: 'sqlite',
  database: 'tessera.sqlite',
  entities: [City, Event],
  migrationsRun: true,
  migrations: [
    CreateCityTable1710598371355,
    CreateEventTable1710656724153,
    AddUniqueNameEventTable1710776435330,
  ],
};

export const optionsTest: DataSourceOptions = {
  type: 'sqlite',
  database: 'tessera-test.sqlite',
  entities: [City, Event],
  migrationsRun: true,
  dropSchema: true,
  migrations: [
    CreateCityTable1710598371355,
    CreateEventTable1710656724153,
    AddUniqueNameEventTable1710776435330,
  ],
};
const datasource = new DataSource(options);
export default datasource;
