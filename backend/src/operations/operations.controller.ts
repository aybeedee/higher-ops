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
} from "@nestjs/common";
import { OperationsService } from "./operations.service";
import {
  CreateOperationDto,
  GetOperationsDto,
  ReplyDto,
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
    @Body() { value }: CreateOperationDto,
  ) {
    return await this.operationsService.createOperation(req.user.id, value);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async reply(
    @Request() req: ReqWithUser,
    @Body() { op, rightValue, parentId }: ReplyDto,
  ) {
    if (op === OperationType.DIV && rightValue === 0) {
      throw new BadRequestException("Division by zero is not allowed");
    }

    const parent = await this.operationsService.findOne({ id: parentId });

    if (!parent) throw new NotFoundException("Parent operation not found");

    return await this.operationsService.createOperationWithPath({
      user: { connect: { id: req.user.id } },
      parent: { connect: { id: parentId } },
      op,
      rightValue,
      value: this.operationsService.calculate(op, parent.value, rightValue),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async fetchAll(@Query() { currentPage, pageSize }: GetOperationsDto) {
    return await this.operationsService.findAll(currentPage, pageSize);
  }
}
