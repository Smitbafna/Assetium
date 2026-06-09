import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class AdminActionDto {
  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class ReturnItemDto {
  @IsString()
  assetId: string;

  @IsInt()
  @Min(1)
  returnedQty: number;
}