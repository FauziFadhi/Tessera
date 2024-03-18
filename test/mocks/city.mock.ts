export const cityCreateMock = {
  name: 'Jakarta',
  countryName: 'Indonesia',
};
export const cityMock = {
  id: 'e15edf5d-c795-40b9-b8f5-790640a7f04f',
  ...cityCreateMock,
};

export const bulkCityCreateMock = [
  cityCreateMock,
  {
    name: 'London',
    countryName: 'United Kingdom',
  },
];
