import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuResolver } from './menu.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from 'src/entities/menu.entity'
import { DishService } from '../dish/dish.service'
import { DishEntity } from 'src/entities/dish.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, DishEntity])],
  providers: [MenuService, MenuResolver, DishService]
})
export class MenuModule {}
