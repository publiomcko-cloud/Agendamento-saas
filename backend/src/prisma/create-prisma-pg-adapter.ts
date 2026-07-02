import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';

export function createPrismaPgAdapter(connectionString: string) {
  const poolConfig: PoolConfig = {
    connectionString,
  };

  if (shouldDisableTlsVerification(connectionString)) {
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
