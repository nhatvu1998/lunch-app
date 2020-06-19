import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DishEntity } from 'src/entities/dish.entity'
import { Repository } from 'typeorm'
import { DishInput } from 'src/graphql.schema'

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>
  ) { }

  async findAll(): Promise<DishEntity[]> {
    return this.dishRepository.find({})
  }

  async addDish(dish: DishInput): Promise<DishEntity> {
    const { name, shopId } = dish
    const newDish = new DishEntity({ name, shopId })
    return await this.dishRepository.save(newDish)
  }

  async find(id: string): Promise<DishEntity[]> {
    return await this.dishRepository.find({ where: { shopId: id.toString() } })
  }
}
