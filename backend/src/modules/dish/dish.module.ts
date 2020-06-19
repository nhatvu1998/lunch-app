import { Module } from '@nestjs/common'
import { DishResolvers } from './dish.resolver'
import { UserModule } from '../user/user.module'
import { DishService } from './dish.service'
import { DishEntity } from 'src/entities/dish.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([DishEntity]),
  ],
  providers: [DishResolvers, DishService],
})
export class DishModule { }
