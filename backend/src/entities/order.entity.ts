import {
  Entity, ObjectIdColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn
} from 'typeorm'
import { IsString, Length, Matches } from 'class-validator'
import { ShopEntity } from './shop.entity'
import { DishEntity } from './dish.entity'
import { DishInfo } from 'src/graphql.schema'
// import { DishEntity } from './dish.entity';

@Entity({
  name: 'orders'
})
export class OrderEntity {
  @ObjectIdColumn()
  @IsString()
  _id: number;

  @Column()
  @IsString()
  userId: string

  @Column()
  @IsString()
  menuId: string

  @Column()
  @IsString()
  dishId: string

  @Column()
  count: number

  @Column()
  isConfirmed: boolean

  @Column()
  @IsString()
  note: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @BeforeInsert()
  async setRole() {
    this.isConfirmed = false
    this.note = ''
  }

  constructor(args: Partial<OrderEntity>) {
    Object.assign(this, args)
  }
}
