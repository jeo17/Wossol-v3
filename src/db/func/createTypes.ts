import { BdataSchema, createBdataColumns } from './createBdata';

export const createTypesColumns = () => ({
  ...createBdataColumns(),
});

export const TypesSchema = {
  ...BdataSchema,
};
