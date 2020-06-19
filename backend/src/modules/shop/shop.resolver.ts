import {
  Resolver, Query, Mutation, Args, ResolveProperty, Parent
} from '@nestjs/graphql'
import { ShopService } from './shop.service'
import { InputCreateShop } from 'src/graphql.schema'
import { DishEntity } from 'src/entities/dish.entity'
import { DishService } from '../dish/dish.service'
import { Roles } from 'src/common/decorators/roles.decorator'

@Resolver('Shop')
export class ShopResolver {
  constructor(
    private readonly shopService: ShopService,
    private readonly dishService: DishService
  ) { }

  @Query()
  @Roles('admin')
  async shops() {
    return this.shopService.findAll()
  }

  @Query()
  // @Roles('admin')
  async shop(@Args('id') id: string) {
    return await this.shopService.findOne(id)
  }

  @Query()
  // @Roles('admin')
  async findShopBySiteId(@Args('siteId') siteId: string) {
    return await this.shopService.find(siteId)
  }

  @Mutation()
  // @Roles('admin')
  async createShop(@Args('data') data: InputCreateShop) {
    return await this.shopService.createShop(data)
  }

  @Mutation()
  // @Roles('admin')
  async deleteShop(@Args('id') id: string) {
    return this.shopService.deleteShop(id)
  }

  @Mutation()
  // @Roles('admin')
  async editShop(@Args('id') id: string, @Args('newName') newName: string) {
    return this.shopService.update(id, newName)
  }

  @ResolveProperty('dishes', () => [DishEntity])
  async dishes(@Parent() shop) {
    return await this.dishService.find(shop._id)
  }
}
