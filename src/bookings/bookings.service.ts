import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Item } from '../items/item.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async create(renterId: number, createBookingDto: CreateBookingDto) {
    const item = await this.itemsRepository.findOne({
      where: { itemId: createBookingDto.itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.status === 'Rented') {
      throw new BadRequestException('Item is already rented');
    }
    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      renterId,
      status: 'Pending',
    });
    return this.bookingsRepository.save(booking);
  }

  async findAll() {
    return this.bookingsRepository.find({ relations: { item: true, renter: true } });
  }

  async findOne(bookingId: number) {
    const booking = await this.bookingsRepository.findOne({
      where: { bookingId },
      relations: { item: true, renter: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findByRenter(renterId: number) {
    return this.bookingsRepository.find({
      where: { renterId },
      relations: { item: true },
    });
  }

  async findByItem(itemId: number) {
    return this.bookingsRepository.find({
      where: { itemId },
      relations: { renter: true },
    });
  }

  async updateStatus(bookingId: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(bookingId);
    booking.status = updateBookingDto.status;

    if (updateBookingDto.status === 'Active') {
      booking.item.status = 'Rented';
      await this.itemsRepository.save(booking.item);
    } else if (updateBookingDto.status === 'Completed' || updateBookingDto.status === 'Cancelled') {
      booking.item.status = 'Available';
      await this.itemsRepository.save(booking.item);
    }

    return this.bookingsRepository.save(booking);
  }

  async remove(bookingId: number) {
    const booking = await this.findOne(bookingId);
    await this.bookingsRepository.remove(booking);
    return { message: 'Booking deleted' };
  }
}