import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, CityConstraintError } from '../entities/event.entity';
import { EventCreateDTO } from './types/event-service.types';
import { CityService } from '@modules/city/services/city.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private repository: Repository<Event>,

    private readonly cityService: CityService,
  ) {}
  async getAll(): Promise<Event[]> {
    return this.repository.find({
      select: ['id', 'name'],
      relations: ['city'],
    });
  }

  /**
   * Creates a new event.
   *
   * @param {EventCreateDTO} dto - The data transfer object containing the information needed to create the event.
   * @return {Promise<Event>} A promise that resolves to the created event.
   */
  async create(dto: EventCreateDTO): Promise<Event> {
    const city = await this.cityService.getOne(dto.cityId);
    if (!city) {
      throw new UnprocessableEntityException('City not found');
    }

    const event = new Event();
    event.name = dto.name;
    event.cityId = dto.cityId;
    return this.repository.save(event).catch((e) => CityConstraintError(e));
  }

  /**
   * Retrieves a single event by its ID.
   *
   * @param {string} eventId - the ID of the event to retrieve
   * @return {Promise<Event | null>} a promise that resolves to the retrieved event or null if not found
   */
  async getOne(eventId: string): Promise<Event | null> {
    return this.repository.findOne({
      where: { id: eventId },
      relations: ['city'],
    });
  }
}
