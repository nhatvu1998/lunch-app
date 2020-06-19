import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderResolver } from './order.resolver'
import { OrderEntity } from 'src/entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from 'src/entities/menu.entity'
import { MenuService } from '../menu/menu.service'
import { DishService } from '../dish/dish.service'
import { DishEntity } from 'src/entities/dish.entity'
import { UserService } from '../user/user.service'
import { UserEntity } from 'src/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, MenuEntity, DishEntity, UserEntity])],
  providers: [OrderService, OrderResolver, MenuService, DishService, UserService]
})
export class OrderModule { }
