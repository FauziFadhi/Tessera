import { City } from 'src/modules/city/entities/city.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateCityTable1710598371355 } from '../modules/city/db/migrations/1710598371355-create_city_table';

export const options: DataSourceOptions = {
  type: 'sqlite',
  database: 'test.sqlite',
  entities: [City],
  migrations: [CreateCityTable1710598371355],
};

const datasource = new DataSource(options);
export default datasource;
