import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AdminActionDto, ReturnItemDto } from './dto/update-booking.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req, @Query() filters: FilterBookingDto) {
    return this.bookingService.findAll(req.user.id, req.user.role, filters);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bookingService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  approve(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.bookingService.approve(id, dto);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  reject(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.bookingService.reject(id, dto);
  }

  @Patch(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    return this.bookingService.cancel(id, req.user.id, req.user.role);
  }

  @Patch(':id/issue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  issue(@Param('id') id: string) {
    return this.bookingService.issue(id);
  }

  @Patch(':id/return')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  returnAssets(@Param('id') id: string, @Body() body: { items: ReturnItemDto[] }) {
    return this.bookingService.returnAssets(id, body.items);
  }

  @Post('flag-overdue')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  flagOverdue() {
    return this.bookingService.flagOverdue();
  }
}