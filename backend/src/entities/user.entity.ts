import {
  Entity, ObjectIdColumn, Column, BeforeInsert
} from 'typeorm'
import { IsString, Length, Matches } from 'class-validator'

@Entity({
  name: 'users'
})
export class UserEntity {
  @ObjectIdColumn()
  @IsString()
  _id: number;

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  @Length(8, 255)
  password: string;

  @Column()
  role: string

  @BeforeInsert()
  async setRole() {
    this.role = 'user'
  }
}
