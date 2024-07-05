import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getDatabaseUrl } from '../utils/env';
import * as schema from './schemas';

const queryClient = postgres(getDatabaseUrl());
export const db = drizzle(queryClient, {
  logger: true,
  schema,
});
