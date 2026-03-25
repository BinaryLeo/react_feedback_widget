import { PrismaClient } from '@prisma/client';

export class PrismaAIConfigRepository {
  constructor(private prisma: PrismaClient) {}

  async findByProjectId(projectId: string) {
    return this.prisma.aIConfig.findUnique({
      where: { projectId },
    });
  }

  async update(projectId: string, data: any) {
    return this.prisma.aIConfig.update({
      where: { projectId },
      data,
    });
  }

  async create(data: any) {
    return this.prisma.aIConfig.create({
      data,
    });
  }
}
