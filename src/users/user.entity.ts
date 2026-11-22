import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from '../items/item.entity';
import { Booking } from '../bookings/booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'renter' })
  role: string;

  @OneToMany(() => Item, (item) => item.owner)
  items: Item[];

  @OneToMany(() => Booking, (booking) => booking.renter)
  bookings: Booking[];
}