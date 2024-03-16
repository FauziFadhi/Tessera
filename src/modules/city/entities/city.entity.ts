import { BadRequestException } from '@nestjs/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TypeORMError,
  AnyError,
  QueryFailedError,
} from 'typeorm';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'country_name' })
  countryName: string;
}

export function CityConstraintError(e: QueryFailedError): never {
  const driverError = e.driverError;
  if ('code' in driverError && driverError?.code === 'SQLITE_CONSTRAINT') {
    // UNIQUE CONSTRAINT
    if (driverError?.['errno'] == 19) {
      if (driverError.message.includes('country_name')) {
        throw new BadRequestException('City name already exists');
      }
    }
  }
  throw e;
}
