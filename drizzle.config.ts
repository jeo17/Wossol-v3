import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './src/utils/env';

export default defineConfig({
  schema: './src/db/schemas/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,

  strict: true,
});
