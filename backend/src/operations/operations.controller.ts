import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { OperationsService } from "./operations.service";
import { CreateOperationDto, GetOperationsDto } from "./operations.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { type ReqWithUser } from "src/lib/types";

@Controller("operations")
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: ReqWithUser,
    @Body() createOperationDto: CreateOperationDto,
  ) {
    return await this.operationsService.create(req.user.id, createOperationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async fetchAll(@Query() { currentPage, pageSize }: GetOperationsDto) {
    return await this.operationsService.findAll(currentPage, pageSize);
  }
}
