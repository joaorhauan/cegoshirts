import { PrismaLibSql } from '@prisma/adapter-libsql';

const config = {
  schema: "prisma/schema.prisma",
  migrate: {
    adapter: () => {
      return new PrismaLibSql({
        url: String(process.env.TURSO_DATABASE_URL),
        authToken: String(process.env.TURSO_AUTH_TOKEN)
      });
    }
  }
};

export default config;