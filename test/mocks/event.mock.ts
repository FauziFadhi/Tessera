import { cityMock } from './city.mock';

export const eventCreateMock = {
  name: 'IU in Jakarta',
  cityId: cityMock.id,
  price: 20,
};

export const eventMock = {
  id: 'a941497d-6bf6-4869-989a-ec5b19bad50a',
  ...eventCreateMock,
};
