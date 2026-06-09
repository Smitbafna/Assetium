import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FilterAssetDto } from './dto/filter-asset.dto';
import { AssetStatus } from '@prisma/client';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    if (dto.serialNumber) {
      const existing = await this.prisma.asset.findUnique({
        where: { serialNumber: dto.serialNumber },
      });
      if (existing) throw new ConflictException('Serial number already exists');
    }

    if (dto.qrCode) {
      const existing = await this.prisma.asset.findUnique({
        where: { qrCode: dto.qrCode },
      });
      if (existing) throw new ConflictException('QR code already exists');
    }

    const quantity = dto.totalQuantity ?? 1;

    return this.prisma.asset.create({
      data: {
        ...dto,
        totalQuantity: quantity,
        availableQuantity: quantity,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
      },
      include: { category: true },
    });
  }

  async findAll(filters: FilterAssetDto) {
    const { search, categoryId, status, condition, location, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
      ...(condition && { condition }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.asset.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.asset.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        category: true,
        maintenanceLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
        damageReports: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async findByQrCode(qrCode: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { qrCode },
      include: { category: true },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async update(id: string, dto: UpdateAssetDto) {
    await this.findOne(id);
    return this.prisma.asset.update({
      where: { id },
      data: {
        ...dto,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
      },
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.asset.delete({ where: { id } });
  }

  // ── Category helpers ──────────────────────────────────────────

  async createCategory(name: string, description?: string, iconUrl?: string) {
    const existing = await this.prisma.category.findUnique({ where: { name } });
    if (existing) throw new ConflictException('Category already exists');
    return this.prisma.category.create({ data: { name, description, iconUrl } });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { assets: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async updateCategory(id: string, name: string, description?: string, iconUrl?: string) {
    return this.prisma.category.update({
      where: { id },
      data: { name, description, iconUrl },
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}