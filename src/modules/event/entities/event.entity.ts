import type { City } from '@modules/city/entities/city.entity';
import { BadRequestException } from '@nestjs/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  QueryFailedError,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'city_id' })
  cityId: string;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne('City', (city: City) => city.id)
  @JoinColumn({ name: 'city_id' })
  city?: City;

  static constraintError(e: QueryFailedError): never {
    const driverError = e.driverError;
    if ('code' in driverError && driverError?.code === 'SQLITE_CONSTRAINT') {
      // UNIQUE CONSTRAINT
      if (driverError?.['errno'] == 19) {
        if (driverError.message.includes('name')) {
          throw new BadRequestException('Event name already exists');
        }
      }
    }
    throw e;
  }
}
