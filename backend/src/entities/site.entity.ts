import {
  Entity, ObjectIdColumn, Column, BeforeInsert
} from 'typeorm'
import { IsString, Length, Matches } from 'class-validator'

@Entity({
  name: 'sites'
})
export class SiteEntity {
  @ObjectIdColumn()
  @IsString()
  _id: number;

  @Column()
  @IsString()
  name: string;

  constructor(args: Partial<SiteEntity>) {
    Object.assign(this, args)
  }
}
