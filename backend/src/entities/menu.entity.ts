import {
  Entity, ObjectIdColumn, Column, BeforeInsert
} from 'typeorm'
import { IsString, Length, Matches } from 'class-validator'
import { ShopEntity } from './shop.entity'
import { DishEntity } from './dish.entity'
import { DishInfo } from 'src/graphql.schema'
// import { DishEntity } from './dish.entity';

@Entity({
  name: 'menu'
})
export class MenuEntity {
  @ObjectIdColumn()
  @IsString()
  _id: number;

  @Column()
  @IsString()
  name: string;

  // @CreateDateColumn()
  // createdDate: Date;

  // @UpdateDateColumn()
  // updatedDate: Date;

  @Column()
  isPublish: boolean;

  @Column()
  isLocked: boolean;

  @Column()
  siteId: string

  @Column()
  shopId: string

  @Column()
  dishes: DishInfo[];

  @BeforeInsert()
  async setRole() {
    this.isPublish = false
  }

  constructor(args: Partial<MenuEntity>) {
    Object.assign(this, args)
  }
}
