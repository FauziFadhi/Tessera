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

export const bulkEventMocks = [
  {
    name: 'IU in Jakarta',
    price: 20,
  },
  {
    name: 'Forever Young',
    price: 5,
  },
  {
    name: 'Taylor Swift Tour',
    price: 100,
  },
];
