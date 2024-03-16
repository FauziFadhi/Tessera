import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CityCreateRequest } from './requests/city.request';
import { transformer } from '@utils/helpers';
import { CityVm } from './viewmodels/city.viewmodel';

@Controller({
  path: 'cities',
  version: '1',
})
export class CityController {
  constructor(private readonly service: CityService) {}

  @Get()
  async getAll(): Promise<CityVm[]> {
    const cities = await this.service.getAll();
    return transformer(CityVm, cities, { raw: true });
  }

  @Get(':cityId')
  async getOne(@Param('cityId') cityId: string): Promise<CityVm> {
    const city = await this.service.getOne(cityId);
    return transformer(CityVm, city, { raw: true });
  }

  @Post()
  async create(@Body() body: CityCreateRequest): Promise<CityVm> {
    const city = await this.service.create(body);
    return transformer(CityVm, city, { raw: true });
  }
}
