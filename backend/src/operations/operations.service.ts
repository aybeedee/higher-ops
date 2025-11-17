import { Injectable } from "@nestjs/common";
import { CreateOperationDto } from "./operations.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOperationDto: CreateOperationDto) {
    return await this.prisma.$transaction(async (tx) => {
      const operation = await tx.operation.create({
        data: {
          userId,
          op: createOperationDto.op,
          value: createOperationDto.value,
        },
      });

      return await tx.operation.update({
        data: { path: `${operation.id}` },
        where: { id: operation.id },
      });
    });
  }

  async findAll(currentPage = 1, pageSize = 20) {
    const take = Math.max(1, Math.min(100, pageSize));
    const skip = Math.max(0, (Math.max(1, currentPage) - 1) * take);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.operation.count(),
      this.prisma.operation.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page: Math.max(1, currentPage),
        pageSize: take,
      },
    };
  }
}
