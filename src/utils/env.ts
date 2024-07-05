export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    process.exit(1);
  }
  return secret;
}

export function getDatabaseUrl(): string {
  const db_url = process.env.DATABASE_URL;
  if (!db_url) {
    process.exit(1);
  }
  return db_url;
}

export function getPasswordSalt(): string {
  const salt = process.env.PASSWORD_SALT;
  if (!salt) {
    process.exit(1);
  }
  return salt;
}
