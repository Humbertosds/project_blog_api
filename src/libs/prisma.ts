import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    adapter: PrismaPg | undefined;
};

const adapter = globalForPrisma.adapter ?? new PrismaPg({ connectionString });

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
    globalForPrisma.adapter = adapter;
}

export { prisma };
