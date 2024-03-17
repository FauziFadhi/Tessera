import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { EventCreateRequest, EventGetQuery } from './requests/event.request';
import { transformer } from '@utils/helpers';
import { EventVm } from './viewmodels/event.viewmodel';
import { SerializeResponse } from '@utils/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Event')
@SerializeResponse()
@Controller({
  path: 'events',
  version: '1',
})
export class EventController {
  constructor(private readonly service: EventService) {}

  @Get()
  async getAll(@Query() q: EventGetQuery): Promise<EventVm[]> {
    const events = await this.service.getAll(q);
    return transformer(EventVm, events, { raw: true });
  }

  @Get(':eventId')
  async getOne(@Param('eventId') eventId: string): Promise<EventVm> {
    const event = await this.service.getOne(eventId);
    if (!event) throw new NotFoundException('Event not found');

    return transformer(EventVm, event, { raw: true });
  }

  @Post()
  async create(@Body() body: EventCreateRequest): Promise<EventVm> {
    const event = await this.service.create(body);
    return transformer(EventVm, event, { raw: true });
  }
}
