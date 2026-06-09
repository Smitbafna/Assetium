import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './create-asset.dto';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { AssetStatus } from '@prisma/client';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  availableQuantity?: number;
}