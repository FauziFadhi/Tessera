import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { CityModule } from '../city/city.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), CityModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
