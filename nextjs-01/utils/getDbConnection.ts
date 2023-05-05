import { PrismaClient } from "@prisma/client";

let prismaClient = new PrismaClient();

export const getDbConnection = () => {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
};
