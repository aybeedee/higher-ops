import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "generated/prisma/client";
import { OperationType } from "generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async createOperationWithPath(data: Prisma.OperationCreateInput) {
    return await this.prisma.$transaction(async (tx) => {
      const operation = await tx.operation.create({ data });
      return await tx.operation.update({
        data: {
          path:
            // assumption here is that operation.path is always set; need to ensure it is always set in all possible ways of operation creation
            // otherwise materialized path searches will be broken
            operation.parentId && operation.path
              ? `${operation.path}.${operation.id}`
              : `${operation.id}`,
        },
        where: { id: operation.id },
      });
    });
  }

  async createOperation(userId: number, value: number) {
    return await this.createOperationWithPath({
      user: { connect: { id: userId } },
      value,
    });
  }

  async findOne(where: Prisma.OperationWhereUniqueInput) {
    return await this.prisma.operation.findUnique({ where });
  }

  async findAll(currentPage = 1, pageSize = 20) {
    const take = Math.max(1, Math.min(100, pageSize));
    const skip = Math.max(0, (Math.max(1, currentPage) - 1) * take);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.operation.count({ where: { parentId: null } }),
      this.prisma.operation.findMany({
        where: { parentId: null },
        include: {
          user: { select: { id: true, username: true } },
          _count: { select: { children: true } },
        },
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
        nextCursor: skip + take < total ? currentPage + 1 : null,
      },
    };
  }

  /*
    for extending this logic for an n depth heirarchical response,
    can add a depth param to the function and query all descendants with materialized path matching + regex or something to match dots separating ids
    and can construct heirarchical response in server code and/or offload to a raw query for better performance with ltree or something
  */
  async findReplies(parentId: number) {
    const parent = await this.findOne({
      id: parentId,
    });

    if (!parent) throw new NotFoundException("Parent operation not found");

    return await this.prisma.operation.findMany({
      where: { parentId },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { children: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  calculate(op: OperationType, leftValue: number, rightValue: number) {
    switch (op) {
      case OperationType.ADD:
        return leftValue + rightValue;
      case OperationType.SUB:
        return leftValue - rightValue;
      case OperationType.MUL:
        return leftValue * rightValue;
      case OperationType.DIV:
        return leftValue / rightValue;
    }
  }
}
