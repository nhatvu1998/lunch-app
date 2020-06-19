import {
  Entity, ObjectIdColumn, Column, BeforeInsert
} from 'typeorm'
import { IsString, Length, Matches } from 'class-validator'

@Entity({
  name: 'shops'
})
export class ShopEntity {
  @ObjectIdColumn()
  @IsString()
  _id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  siteId: string;

  constructor(args: Partial<ShopEntity>) {
    Object.assign(this, args)
  }
}
