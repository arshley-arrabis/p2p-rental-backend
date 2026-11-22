import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async create(ownerId: number, createItemDto: CreateItemDto) {
    const item = this.itemsRepository.create({
      ...createItemDto,
      ownerId,
      status: 'Available',
    });
    return this.itemsRepository.save(item);
  }

  async findAll(status?: string) {
    if (status) {
      return this.itemsRepository.find({ where: { status } });
    }
    return this.itemsRepository.find();
  }

  async findOne(itemId: number) {
    const item = await this.itemsRepository.findOne({ where: { itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async findByOwner(ownerId: number) {
    return this.itemsRepository.find({ where: { ownerId } });
  }

  async update(itemId: number, userId: number, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(itemId);
    if (item.ownerId !== userId) {
      throw new UnauthorizedException('Not your item');
    }
    Object.assign(item, updateItemDto);
    return this.itemsRepository.save(item);
  }

  async remove(itemId: number, userId: number) {
    const item = await this.findOne(itemId);
    if (item.ownerId !== userId) {
      throw new UnauthorizedException('Not your item');
    }
    await this.itemsRepository.remove(item);
    return { message: 'Item deleted' };
  }
}