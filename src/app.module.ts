import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '@modules/city/city.module';
import { options } from './config/datasource';
import { EventModule } from '@modules/event/event.module';

@Module({
  imports: [CityModule, EventModule, TypeOrmModule.forRoot(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
