import { Entity, Column, ObjectIdColumn } from 'typeorm'

@Entity({
  name: 'dishes'
})
export class DishEntity {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  shopId: string

  constructor(args: Partial<DishEntity>) {
    Object.assign(this, args)
  }
}
