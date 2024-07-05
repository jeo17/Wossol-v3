import { BdataSchema, createBdataColumns } from './createBdata';

export const createStatesColumns = () => ({
  ...createBdataColumns(),
});

export const StatesSchema = {
  ...BdataSchema,
};
