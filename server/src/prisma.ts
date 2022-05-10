import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log:['query']//* show in console when a query is executed;
    
});