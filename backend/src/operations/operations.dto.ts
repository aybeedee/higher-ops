import { OperationType } from "generated/prisma/enums";
import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateOperationBodyDto {
  @IsNumber()
  @Max(9000)
  @Min(-9000)
  value: number;
}

export class ReplyParamsDto {
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  parentId: number;
}

export class ReplyBodyDto {
  @IsEnum(OperationType)
  op: OperationType;

  @IsNumber()
  @Max(9000)
  @Min(-9000)
  rightValue: number;
}

export class GetOperationsQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  currentPage?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  pageSize?: number;
}
