import { QueryFailedError, Repository } from 'typeorm';
import { EventService } from './event.service';
import { TestBed } from '@automock/jest';
import { eventCreateMock, eventMock } from '@mocks/event.mock';
import { Event } from '../entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityService } from '@modules/city/services/city.service';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventAllFilter } from './types/event-service.types';
import { cityMock } from '@mocks/city.mock';

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: jest.Mocked<Repository<Event>>;
  let cityService: jest.Mocked<CityService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(EventService).compile();

    eventService = unit;
    eventRepository = unitRef.get(getRepositoryToken(Event) as any);
    cityService = unitRef.get(CityService);
  });

  describe('getOne', () => {
    it('should return the event data', async () => {
      const eventId = eventMock.id;

      eventRepository.findOne.mockResolvedValueOnce(eventMock);
      const event = await eventService.getOne(eventId);

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        relations: ['city'],
        where: { id: eventId },
      });

      expect(event.id).toEqual(eventId);
      expect(event).toEqual(eventMock);
    });

    it('should return null if not found', async () => {
      const eventId = eventMock.id;
      eventRepository.findOne.mockResolvedValueOnce(null);
      const event = await eventService.getOne(eventId);

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        relations: ['city'],
        where: { id: eventId },
      });

      expect(event).toEqual(null);
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createdEvent: Event = eventMock;
      const eventDTO = eventCreateMock;
      cityService.getOne.mockResolvedValueOnce(cityMock);
      eventRepository.save.mockResolvedValueOnce(createdEvent);

      const event = await eventService.create(eventDTO);
      expect(eventRepository.save).toHaveBeenCalledWith({
        ...eventDTO,
      });

      expect(event).toBe(createdEvent);
    });
    it('should throw an error if city not found', async () => {
      const eventDTO = eventCreateMock;
      cityService.getOne.mockResolvedValueOnce(null);

      expect(eventService.create(eventDTO)).rejects.toThrow(
        new UnprocessableEntityException('City not found'),
      );

      expect(eventRepository.save).not.toHaveBeenCalled();
    });

    it('should call constraintError when save rejects with an error', async () => {
      const error = new QueryFailedError('query error', [], {
        code: 'SQLITE_CONSTRAINT',
        message: 'UNIQUE constraint failed: city.name',
        errno: 19,
      } as any);

      cityService.getOne.mockResolvedValueOnce(cityMock);
      eventRepository.save.mockRejectedValueOnce(error);

      const constraintErrorMock = jest.spyOn(Event, 'constraintError');

      await expect(eventService.create(eventCreateMock)).rejects.toThrow(
        new BadRequestException('Event name already exists'),
      );

      expect(eventRepository.save).toHaveBeenCalledWith(eventCreateMock);

      expect(constraintErrorMock).toHaveBeenCalledWith(error);

      constraintErrorMock.mockRestore();
    });
  });

  describe('getAll', () => {
    const queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce([eventMock]),
    };
    beforeEach(() => {
      jest
        .spyOn(eventRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);
    });
    it('should join the events with the city', async () => {
      await eventService.getAll();

      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
        'event.city',
        'city',
      );
    });

    it('should filter the events by city id if provided in the filter', async () => {
      const filter: EventAllFilter = {
        cityId: eventMock.cityId,
      };
      await eventService.getAll(filter);

      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'event.cityId = :cityId',
        {
          cityId: filter.cityId,
        },
      );
    });

    it('should filter the events by max price if provided in the filter', async () => {
      const filter: EventAllFilter = {
        maxPrice: 100,
      };
      await eventService.getAll(filter);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'event.price <= :maxPrice',
        {
          maxPrice: filter.maxPrice,
        },
      );
    });

    it('should filter the events by min price if provided in the filter', async () => {
      const filter: EventAllFilter = {
        minPrice: 50,
      };
      await eventService.getAll(filter);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'event.price >= :minPrice',
        {
          minPrice: filter.minPrice,
        },
      );
    });

    it('should filter the events by name if provided in the filter', async () => {
      const filter: EventAllFilter = {
        name: 'test',
      };
      await eventService.getAll(filter);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'event.name LIKE :name COLLATE NOCASE',
        {
          name: `%${filter.name}%`,
        },
      );
    });

    it('should return the events', async () => {
      queryBuilderMock.getMany.mockResolvedValueOnce([eventMock]);
      const events = await eventService.getAll();
      expect(events).toEqual([eventMock]);
    });
  });
});
