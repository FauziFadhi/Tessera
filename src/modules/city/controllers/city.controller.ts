import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CityCreateRequest, CityGetQuery } from './requests/city.request';
import { transformer } from '@utils/helpers';
import { CityVm } from './viewmodels/city.viewmodel';
import { SerializeResponse } from '@utils/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('City')
@SerializeResponse()
@Controller({
  path: 'cities',
  version: '1',
})
export class CityController {
  constructor(private readonly service: CityService) {}

  @Get()
  async getAll(@Query() query: CityGetQuery): Promise<CityVm[]> {
    const cities = await this.service.getAll(query);
    return transformer(CityVm, cities, { raw: true });
  }

  @Get(':cityId')
  async getOne(@Param('cityId') cityId: string): Promise<CityVm> {
    const city = await this.service.getOne(cityId);
    if (!city) throw new NotFoundException('City not found');

    return transformer(CityVm, city, { raw: true });
  }

  @Post()
  async create(@Body() body: CityCreateRequest): Promise<CityVm> {
    const city = await this.service.create(body);
    return transformer(CityVm, city, { raw: true });
  }
}
