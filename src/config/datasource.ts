import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const options: DataSourceOptions = {
  type: 'sqlite',
  database: 'tessera.sqlite',
  migrationsRun: true,
  entities: [join(__dirname, '..', 'modules', '**', 'entities', '*{.ts,.js}')],
  migrations: [
    join(__dirname, '..', 'modules', '**', 'db', 'migrations', '*{.ts,.js}'),
  ],
};

export const optionsTest: DataSourceOptions = {
  type: 'sqlite',
  database: 'tessera-test.sqlite',
  migrationsRun: true,
  dropSchema: true,
  entities: [join(__dirname, '..', 'modules', '**', 'entities', '*{.ts,.js}')],
  migrations: [
    join(__dirname, '..', 'modules', '**', 'db', 'migrations', '*{.ts,.js}'),
  ],
};
const datasource = new DataSource(options);
export default datasource;
