import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AdminActionDto, ReturnItemDto } from './dto/update-booking.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { BookingStatus, AssetStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // ── Create Booking ────────────────────────────────────────────

  async create(userId: string, dto: CreateBookingDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end <= start) throw new BadRequestException('endDate must be after startDate');

    // Validate all assets exist and have enough availability
    for (const item of dto.items) {
      const asset = await this.prisma.asset.findUnique({ where: { id: item.assetId } });
      if (!asset) throw new NotFoundException(`Asset ${item.assetId} not found`);
      if (asset.status === AssetStatus.RETIRED || asset.status === AssetStatus.UNDER_MAINTENANCE)
        throw new BadRequestException(`Asset ${asset.name} is not available for booking`);
      if (asset.availableQuantity < item.quantity)
        throw new BadRequestException(`Insufficient quantity for asset ${asset.name}`);
    }

    return this.prisma.booking.create({
      data: {
        userId,
        purpose: dto.purpose,
        startDate: start,
        endDate: end,
        items: {
          create: dto.items.map(i => ({
            assetId: i.assetId,
            quantity: i.quantity,
          })),
        },
        assets: {
          connect: dto.items.map(i => ({ id: i.assetId })),
        },
      },
      include: { items: { include: { asset: true } }, user: true },
    });
  }

  // ── Find All (admin sees all, user sees own) ──────────────────

  async findAll(requesterId: string, requesterRole: string, filters: FilterBookingDto) {
    const { status, userId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(requesterRole === 'ADMIN' || requesterRole === 'MANAGER'
        ? userId ? { userId } : {}
        : { userId: requesterId }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: { items: { include: { asset: true } }, user: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Find One ──────────────────────────────────────────────────

  async findOne(id: string, requesterId: string, requesterRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { items: { include: { asset: true } }, user: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (requesterRole === 'USER' && booking.userId !== requesterId)
      throw new ForbiddenException('Access denied');

    return booking;
  }

  // ── Approve ───────────────────────────────────────────────────

  async approve(id: string, dto: AdminActionDto) {
    const booking = await this.getBookingOrFail(id);
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only PENDING bookings can be approved');

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.APPROVED, adminNote: dto.adminNote },
      include: { items: { include: { asset: true } } },
    });
  }

  // ── Reject ────────────────────────────────────────────────────

  async reject(id: string, dto: AdminActionDto) {
    const booking = await this.getBookingOrFail(id);
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Only PENDING bookings can be rejected');

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.REJECTED, adminNote: dto.adminNote },
      include: { items: { include: { asset: true } } },
    });
  }

  // ── Cancel (user cancels own pending booking) ─────────────────

  async cancel(id: string, requesterId: string, requesterRole: string) {
    const booking = await this.getBookingOrFail(id);

    if (requesterRole === 'USER' && booking.userId !== requesterId)
      throw new ForbiddenException('Access denied');

if (!([ BookingStatus.PENDING, BookingStatus.APPROVED ] as BookingStatus[]).includes(booking.status))
      throw new BadRequestException('Booking cannot be cancelled at this stage');

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  // ── Issue (admin hands over asset) ───────────────────────────

  async issue(id: string) {
    const booking = await this.getBookingOrFail(id);
    if (booking.status !== BookingStatus.APPROVED)
      throw new BadRequestException('Only APPROVED bookings can be issued');

    // Decrease availableQuantity for each item
    await this.prisma.$transaction(async (tx) => {
      for (const item of booking.items) {
        const asset = await tx.asset.findUnique({ where: { id: item.assetId } });
        if (!asset || asset.availableQuantity < item.quantity)
          throw new BadRequestException(`Insufficient quantity for asset ${item.assetId}`);

        const newQty = asset.availableQuantity - item.quantity;
        await tx.asset.update({
          where: { id: item.assetId },
          data: {
            availableQuantity: newQty,
            status: newQty === 0
              ? AssetStatus.UNAVAILABLE
              : newQty < asset.totalQuantity
              ? AssetStatus.PARTIALLY_AVAILABLE
              : AssetStatus.AVAILABLE,
          },
        });
      }

      await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.ISSUED },
      });
    });

    return this.findOneById(id);
  }

  // ── Return ────────────────────────────────────────────────────

  async returnAssets(id: string, returnItems: ReturnItemDto[]) {
    const booking = await this.getBookingOrFail(id);
    if (!([ BookingStatus.ISSUED, BookingStatus.OVERDUE ] as BookingStatus[]).includes(booking.status))

      throw new BadRequestException('Only ISSUED or OVERDUE bookings can be returned');

    await this.prisma.$transaction(async (tx) => {
      for (const ret of returnItems) {
        const bookingItem = booking.items.find(i => i.assetId === ret.assetId);
        if (!bookingItem) throw new BadRequestException(`Asset ${ret.assetId} not in this booking`);

        const maxReturnable = bookingItem.quantity - bookingItem.returnedQty;
        if (ret.returnedQty > maxReturnable)
          throw new BadRequestException(`Cannot return more than issued quantity`);

        await tx.bookingItem.update({
          where: { id: bookingItem.id },
          data: { returnedQty: bookingItem.returnedQty + ret.returnedQty },
        });

        const asset = await tx.asset.findUnique({ where: { id: ret.assetId } });
        const newQty = asset!.availableQuantity + ret.returnedQty;
        await tx.asset.update({
          where: { id: ret.assetId },
          data: {
            availableQuantity: newQty,
            status: newQty >= asset!.totalQuantity
              ? AssetStatus.AVAILABLE
              : AssetStatus.PARTIALLY_AVAILABLE,
          },
        });
      }

      // Check if all items fully returned
      const updatedItems = await tx.bookingItem.findMany({ where: { bookingId: id } });
      const allReturned = updatedItems.every(i => i.returnedQty >= i.quantity);

      if (allReturned) {
        await tx.booking.update({
          where: { id },
          data: { status: BookingStatus.RETURNED, actualReturnDate: new Date() },
        });
      }
    });

    return this.findOneById(id);
  }

  // ── Flag Overdue (manual trigger) ────────────────────────────

  async flagOverdue() {
    const now = new Date();
    const overdueBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.ISSUED,
        endDate: { lt: now },
        isOverdue: false,
      },
    });

    await this.prisma.booking.updateMany({
      where: {
        id: { in: overdueBookings.map(b => b.id) },
      },
      data: {
        status: BookingStatus.OVERDUE,
        isOverdue: true,
      },
    });

    return { flagged: overdueBookings.length };
  }

  // ── Helpers ───────────────────────────────────────────────────

  private async getBookingOrFail(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  private async findOneById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { items: { include: { asset: true } }, user: true },
    });
  }
}