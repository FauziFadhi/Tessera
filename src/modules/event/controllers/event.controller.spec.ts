import { Test } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from '../services/event.service';
import { CityModule } from '@modules/city/city.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { bulkEventMocks, eventCreateMock, eventMock } from '@mocks/event.mock';
import { Event } from '../entities/event.entity';
import { optionsTest } from '@config/datasource';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CityService } from '@modules/city/services/city.service';
import { bulkCityCreateMock, cityCreateMock, cityMock } from '@mocks/city.mock';
import { transformer } from '@utils/helpers';
import { EventVm } from './viewmodels/event.viewmodel';
import { Repository } from 'typeorm';

describe('EventController (Integration)', () => {
  let eventController: EventController;
  let eventService: EventService;
  let cityService: CityService;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(optionsTest),
        TypeOrmModule.forFeature([Event]),
        CityModule,
      ],
      controllers: [EventController],
      providers: [EventService],
    }).compile();

    eventController = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
    cityService = module.get<CityService>(CityService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('getOne', () => {
    let cityId: string;

    afterEach(async () => {
      if (cityId) {
        await cityService.delete(cityId);
      }
    });
    it('should throw error if event not found', async () => {
      const eventId = eventMock.id;

      await expect(eventController.getOne(eventId)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );
    });

    it('should return event data', async () => {
      ({ id: cityId } = await cityService.create(cityCreateMock));
      const eventCreateDTO = {
        ...eventCreateMock,
        cityId,
      };
      const { id: eventId } = await eventService.create({
        ...eventCreateDTO,
        cityId,
      });

      const event = await eventController.getOne(eventId);

      expect(event).toEqual(
        transformer(EventVm, {
          ...eventCreateDTO,
          id: eventId,
          city: {
            ...cityCreateMock,
            id: cityId,
          },
        }),
      );
    });
  });

  describe('create', () => {
    let cityId: string, eventId: string;
    const cityIds: string[] = [];
    afterEach(async () => {
      if (cityId) {
        await cityService.delete(cityId);
      }
      if (eventId) {
        await eventRepository.delete({ id: eventId });
      }
      if (cityIds.length) {
        await Promise.all(cityIds.map((id) => cityService.delete(id)));
      }
    });
    it('should create a new event', async () => {
      ({ id: cityId } = await cityService.create(cityCreateMock));
      const eventCreateDTO = {
        ...eventCreateMock,
        cityId,
      };

      const event = await eventController.create(eventCreateDTO);

      expect(event).toEqual(transformer(EventVm, event));
    });

    it('should throw an error if city not found', async () => {
      const eventCreateDTO = {
        ...eventCreateMock,
        cityId: cityMock.id + '1',
      };
      expect(eventController.create(eventCreateDTO)).rejects.toThrow(
        new NotFoundException('City not found'),
      );
    });

    it('should throw an error if event already exists', async () => {
      ({ id: cityId } = await cityService.create(cityCreateMock));
      const eventCreateDTO = {
        ...eventCreateMock,
        cityId,
      };

      ({ id: eventId } = await eventService.create(eventCreateDTO));
      await expect(eventController.create(eventCreateDTO)).rejects.toThrow(
        new BadRequestException('Event name already exists'),
      );
    });
  });

  describe('getAll', () => {
    const cityIds: string[] = [];
    const createdCities = {};
    const eventIds: string[] = [];
    beforeEach(async () => {
      for (const city of bulkCityCreateMock) {
        const createdCity = await cityService.create(city);
        cityIds.push(createdCity.id);
        createdCities[createdCity.id] = createdCity;
      }

      for (const [index, event] of bulkEventMocks.entries()) {
        const { id: eventId } = await eventService.create({
          ...event,
          cityId: index === 2 ? cityIds[0] : cityIds[1],
        });
        eventIds.push(eventId);
      }
    });

    afterEach(async () => {
      await Promise.all(
        cityIds.map(async (id) => {
          await cityService.delete(id);
          delete createdCities[id];
        }),
      );
      await Promise.all(
        eventIds.map(async (id) => eventRepository.delete({ id })),
      );
      cityIds.length = 0;
      eventIds.length = 0;
    });
    it('should return all events', async () => {
      const events = await eventController.getAll({});
      expect(events).toEqual(
        transformer(
          EventVm,
          bulkEventMocks.map((event, index) => ({
            ...event,
            id: eventIds[index],
            city: createdCities[index === 2 ? cityIds[0] : cityIds[1]],
          })),
          { raw: true },
        ),
      );
    });

    it('should return filtered events by name', async () => {
      const events = await eventController.getAll({ name: 'iu' });
      expect(events).toHaveLength(1);
      events.map((event) => {
        expect(event.name).toContain('IU');
      });
    });
    it('should return filtered events by cityId', async () => {
      const events = await eventController.getAll({ cityId: cityIds[1] });
      expect(events).toHaveLength(2);

      events.map((event) => {
        expect(event.city.id).toEqual(cityIds[1]);
      });
    });

    it('should return filtered events by max price', async () => {
      const events = await eventController.getAll({ maxPrice: 90 });
      expect(events).toHaveLength(2);
      events.map((event) => {
        expect(event.price).toBeLessThanOrEqual(90);
      });
    });
    it('should return filtered events by min price', async () => {
      const events = await eventController.getAll({ minPrice: 90 });
      expect(events).toHaveLength(1);
      events.map((event) => {
        expect(event.price).toBeGreaterThanOrEqual(90);
      });
    });
  });
});
