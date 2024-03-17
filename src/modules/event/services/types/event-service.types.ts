export type EventCreateDTO = {
  name: string;
  cityId: string;
  price: number;
};

export type EventAllFilter = {
  name?: string;
  cityId?: string;
  maxPrice?: number;
  minPrice?: number;
};
