import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City, CityConstraintError } from '../entities/city.entity';
import { CityCreateDTO } from './types/city-service.types';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private repository: Repository<City>,
  ) {}
  async getAll(): Promise<City[]> {
    return this.repository.find({
      select: ['id', 'name', 'countryName'],
    });
  }

  /**
   * Create a new city using the provided CityCreateDTO.
   *
   * @param {CityCreateDTO} dto - The data transfer object containing information for creating a city
   * @return {Promise<City>} A promise that resolves with the newly created city
   */
  async create(dto: CityCreateDTO): Promise<City> {
    const city = new City();
    city.name = dto.name;
    city.countryName = dto.countryName;
    return this.repository.save(city).catch((e) => CityConstraintError(e));
  }

  /**
   * Retrieve a single city by its ID.
   *
   * @param {string} cityId - the ID of the city
   * @return {Promise<City | null>} a Promise that resolves to the found city or null if not found
   */
  async getOne(cityId: string): Promise<City | null> {
    return this.repository.findOne({ where: { id: cityId } });
  }
}
