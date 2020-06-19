import {
  Resolver, Query, Mutation, Args, Context, Subscription
} from '@nestjs/graphql'
import { MenuService } from './menu.service'
import { InputCreateMenu, InputAddDish, FileInput, DishInfo, DishMenuInput } from 'src/graphql.schema'
import { Roles } from 'src/common/decorators/roles.decorator'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

@Resolver('Menu')
export class MenuResolver {
  constructor(
    private readonly menuService: MenuService
  ) { }

  @Query()
  @Roles('admin')
  async menu() {
    return this.menuService.findAll()
  }

  @Query()
  @Roles('admin')
  async findById(@Args('id') id: string) {
    return this.menuService.findById(id)
  }

  @Query()
  @Roles('admin')
  async findMenuBySiteId(@Args('siteId') siteId: string) {
    return this.menuService.findBySiteId(siteId)
  }

  @Query()
  async findPublishMenu(@Args('siteId') siteId: string) {
    const menu = await this.menuService.findPublishMenuBySiteId(siteId)
    pubSub.publish('menuUpdate', { menuUpdate: menu })
    return menu
  }

  @Mutation()
  async createMenu(@Args('data') data: InputCreateMenu) {
    return this.menuService.create(data)
  }

  @Mutation()
  async addDishes(@Args('data') data: InputAddDish) {
    return this.menuService.addDishes(data)
  }

  @Mutation()
  async importMenu(
    @Args('_id') _id: string,
    @Args('shopId') shopId: string,
    @Args('fileInput') fileInput: FileInput[],
    @Context() context
  ) {
    const siteId = context.currentsite
    console.log('constext site', siteId)
    const result = await this.menuService.import(_id, shopId, fileInput, siteId)
    return result
  }

  @Mutation()
  async publishMenu(@Args('id') id: string) {
    return this.menuService.publish(id)
  }

  @Mutation()
  async lockMenu(@Args('siteId') siteId: string) {
    return this.menuService.lockMenu(siteId)
  }

  @Mutation()
  @Roles('admin')
  async updateMenu(
    @Args('menuId') menuId: string,
    @Args('dishes') dishes: [DishMenuInput]
  ) {
    return this.menuService.updateOrder(menuId, JSON.parse(JSON.stringify(dishes)))
  }

  @Subscription()
  orderUpdate() {
    return pubSub.asyncIterator('menuUpdate')
  }
}
