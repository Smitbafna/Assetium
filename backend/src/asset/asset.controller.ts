import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FilterAssetDto } from './dto/filter-asset.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  // ── Assets ────────────────────────────────────────────────────

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateAssetDto) {
    return this.assetService.create(dto);
  }

  @Get()
  findAll(@Query() filters: FilterAssetDto) {
    return this.assetService.findAll(filters);
  }

  @Get('qr/:qrCode')
  findByQrCode(@Param('qrCode') qrCode: string) {
    return this.assetService.findByQrCode(qrCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.assetService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }

  // ── Categories ────────────────────────────────────────────────

  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createCategory(@Body() body: { name: string; description?: string; iconUrl?: string }) {
    return this.assetService.createCategory(body.name, body.description, body.iconUrl);
  }

  @Get('categories/all')
  findAllCategories() {
    return this.assetService.findAllCategories();
  }

  @Patch('categories/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateCategory(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string; iconUrl?: string },
  ) {
    return this.assetService.updateCategory(id, body.name, body.description, body.iconUrl);
  }

  @Delete('categories/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteCategory(@Param('id') id: string) {
    return this.assetService.deleteCategory(id);
  }
}