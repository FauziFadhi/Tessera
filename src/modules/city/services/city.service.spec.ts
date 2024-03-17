import { QueryFailedError, Repository } from 'typeorm';
import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityService } from '@modules/city/services/city.service';
import { BadRequestException } from '@nestjs/common';
import { City } from '../entities/city.entity';
import { cityCreateMock, cityMock } from '@mocks/city.mock';
import { CityAllFilter } from './types/city-service.types';

describe('CityService', () => {
  let cityService: CityService;
  let cityRepository: jest.Mocked<Repository<City>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CityService).compile();

    cityService = unit;
    cityRepository = unitRef.get(getRepositoryToken(City) as any);
  });

  describe('getOne', () => {
    it('should return the city data', async () => {
      const cityId = cityMock.id;

      cityRepository.findOne.mockResolvedValueOnce(cityMock);
      const city = await cityService.getOne(cityId);

      expect(cityRepository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
      });

      expect(city.id).toEqual(cityId);
      expect(city).toEqual(cityMock);
    });

    it('should return null if not found', async () => {
      const cityId = cityMock.id;
      cityRepository.findOne.mockResolvedValueOnce(null);
      const city = await cityService.getOne(cityId);

      expect(cityRepository.findOne).toHaveBeenCalledWith({
        where: { id: cityId },
      });

      expect(city).toEqual(null);
    });
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const createdCity: City = cityMock;
      const cityDTO = cityCreateMock;

      cityRepository.save.mockResolvedValueOnce(createdCity);

      const city = await cityService.create(cityDTO);
      expect(cityRepository.save).toHaveBeenCalledWith({
        ...cityDTO,
      });

      expect(city).toBe(createdCity);
    });

    it('should throw an error if city already exists', async () => {
      const error = new QueryFailedError('query error', [], {
        code: 'SQLITE_CONSTRAINT',
        message: 'UNIQUE constraint failed: city.name',
        errno: 19,
      } as any);

      cityRepository.save.mockRejectedValueOnce(error);
      const constraintErrorMock = jest.spyOn(City, 'constraintError');

      await expect(cityService.create(cityCreateMock)).rejects.toThrow(
        new BadRequestException('City name already exists'),
      );

      expect(cityRepository.save).toHaveBeenCalledWith(cityCreateMock);
      expect(constraintErrorMock).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    const queryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce([cityMock]),
    };
    beforeEach(() => {
      jest
        .spyOn(cityRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);
    });

    it('should add where if filter name is provided', async () => {
      const filter = {
        name: cityMock.name,
      };
      await cityService.getAll(filter);

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'city.name LIKE :name COLLATE NOCASE',
        {
          name: `%${filter.name}%`,
        },
      );
    });

    it('should add where if filter countryName is not provided', async () => {
      const filter: CityAllFilter = {
        countryName: cityMock.countryName,
      };
      await cityService.getAll(filter);

      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'city.country_name LIKE :countryName COLLATE NOCASE',
        {
          countryName: `%${filter.countryName}%`,
        },
      );
    });

    it('should return the cities', async () => {
      queryBuilderMock.getMany.mockResolvedValueOnce([cityMock]);
      const cities = await cityService.getAll();
      expect(cities).toEqual([cityMock]);
    });
  });
});
