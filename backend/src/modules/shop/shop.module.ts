import { Module } from '@nestjs/common'
import { ShopResolver } from './shop.resolver'
import { ShopService } from './shop.service'
import { ShopEntity } from 'src/entities/shop.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DishEntity } from 'src/entities/dish.entity'
import { DishService } from '../dish/dish.service'

@Module({
  imports: [TypeOrmModule.forFeature([ShopEntity, DishEntity])],
  providers: [ShopResolver, ShopService, DishService]
})
export class ShopModule { }
