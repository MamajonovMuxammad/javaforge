import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const isDbConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "");

let prismaInstance: PrismaClient | null = null;

if (isDbConfigured) {
  if (process.env.NODE_ENV === "production") {
    prismaInstance = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ["warn", "error"],
      });
    }
    prismaInstance = global.prisma;
  }
}

export const prisma = prismaInstance;
export { isDbConfigured };
