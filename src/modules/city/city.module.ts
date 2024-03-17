import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
