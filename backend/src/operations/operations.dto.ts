import { OperationType } from "generated/prisma/enums";
import { IsEnum, IsNumber, IsOptional, Max } from "class-validator";
import { Transform } from "class-transformer";

export class CreateOperationDto {
  @IsNumber()
  @Max(9000)
  value: number;
}

export class ReplyDto {
  @IsEnum(OperationType)
  op: OperationType;

  @IsNumber()
  @Max(9000)
  rightValue: number;

  @IsNumber()
  parentId: number;
}

export class GetOperationsDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  currentPage?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  pageSize?: number;
}
