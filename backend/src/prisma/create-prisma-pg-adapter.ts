import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';

export function createPrismaPgAdapter(connectionString: string) {
  const shouldDisableTls = shouldDisableTlsVerification(connectionString);
  const poolConfig: PoolConfig = {
    connectionString: shouldDisableTls
      ? forceNoVerifySslMode(connectionString)
      : connectionString,
  };

  if (shouldDisableTls) {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }

  return new PrismaPg(poolConfig);
}

function shouldDisableTlsVerification(connectionString: string) {
  const value = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

  if (value) {
    return value.toLowerCase() === 'false';
  }

  return connectionString.includes('supabase.co');
}

function forceNoVerifySslMode(connectionString: string) {
  const url = new URL(connectionString);

  url.searchParams.set('sslmode', 'no-verify');

  return url.toString();
}
