export type CityCreateDTO = {
  name: string;
  countryName: string;
};

export type CityAllFilter = {
  countryName?: string;
  name?: string;
};
