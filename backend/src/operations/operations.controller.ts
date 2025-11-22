import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { OperationsService } from "./operations.service";
import {
  CreateOperationBodyDto,
  GetOperationsQueryDto,
  ReplyBodyDto,
  ReplyParamsDto,
} from "./operations.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { type ReqWithUser } from "src/lib/types";
import { OperationType } from "generated/prisma/enums";

@Controller("operations")
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: ReqWithUser,
    @Body() body: CreateOperationBodyDto,
  ) {
    return await this.operationsService.createOperation(
      req.user.id,
      body.value,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(":parentId/reply")
  async reply(
    @Request() req: ReqWithUser,
    @Param() params: ReplyParamsDto,
    @Body() body: ReplyBodyDto,
  ) {
    const { op, rightValue } = body;

    if (op === OperationType.DIV && rightValue === 0) {
      throw new BadRequestException("Division by zero is not allowed");
    }

    const parent = await this.operationsService.findOne({
      id: params.parentId,
    });

    if (!parent) throw new NotFoundException("Parent operation not found");

    return await this.operationsService.createOperationWithPath({
      user: { connect: { id: req.user.id } },
      parent: { connect: { id: params.parentId } },
      op,
      rightValue,
      value: this.operationsService.calculate(op, parent.value, rightValue),
    });
  }

  @Get()
  async fetchAll(@Query() { currentPage, pageSize }: GetOperationsQueryDto) {
    return await this.operationsService.findAll(currentPage, pageSize);
  }
}
