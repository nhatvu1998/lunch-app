import {
  Resolver, Query, Mutation, Context, Args, ResolveProperty, Parent, Subscription
} from '@nestjs/graphql'
import { OrderService } from './order.service'
import { OrderEntity } from 'src/entities/order.entity'
import { InputCreateOrder, DishInfo, InputCreateOrderByAdmin } from 'src/graphql.schema'
import { Roles } from 'src/common/decorators/roles.decorator'
import { UserEntity } from 'src/entities/user.entity'
import { UserService } from '../user/user.service'
import { PubSub } from 'graphql-subscriptions'
import { MenuService } from '../menu/menu.service'
import { MenuEntity } from 'src/entities/menu.entity'

const pubSub = new PubSub()

@Resolver('Order')
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly menuService: MenuService
  ) { }

  @Query()
  async orders() {
    return this.orderService.findAll()
  }

  @Query()
  @Roles('admin', 'user')
  async findOrderByUserId(@Context('user') user) {
    return this.orderService.findByUserId(user.userId)
  }

  @Query()
  // @Roles('admin')
  async findOrderByMenuId(@Args('menuId') menuId: string) {
    return this.orderService.findByMenuId(menuId)
  }

  @Mutation()
  @Roles('admin', 'user')
  async createOrder(
    @Context('user') user,
    @Args('input') input: InputCreateOrder
  ) {
    console.log(user)
    const { dishId, menuId } = input
    const order = await this.orderService.createOrder(dishId, user.userId, menuId)
    pubSub.publish('orderUpdate', { orderUpdate: order })
    return order
  }

  @Mutation()
  @Roles('admin')
  async createOrderByAdmin(
    @Args('input') input: InputCreateOrderByAdmin
  ) {
    const { dishId, userId, menuId } = input
    const order = await this.orderService.createOrder(dishId, userId, menuId)
    return order
  }

  @Mutation()
  @Roles('admin', 'user')
  async deleteOrder(
    @Context('user') user,
    @Args('dishId') dishId: string
  ) {
    const order = await this.orderService.deleteOrder(dishId, user.userId)
    return order
  }

  @Mutation()
  // @Roles('admin')
  async deleteOrderByAdmin(
    @Args('dishId') dishId: string,
    @Args('userId') userId: string
  ) {
    const order = await this.orderService.deleteOrder(dishId, userId)
    return order
  }

  @Mutation()
  @Roles('admin', 'user')
  async addNote(
    @Context('user') user,
    @Args('input') input: string
  ) {
    const note = await this.orderService.addNote(input, user.userId)
    return note
  }

  @Mutation()
  @Roles('user')
  async confirmEat(
    @Context('user') user,
  ) {
    const confirm = await this.orderService.confirmEat(user.userId)
    return confirm
  }

  @ResolveProperty('user', () => [UserEntity])
  async getUser(@Parent() order) {
    const user = await this.userService.findById(order.userId)
    return user
  }

  @ResolveProperty('menu', () => [MenuEntity])
  async getMenu(@Parent() order) {
    const menu = await this.menuService.findById(order.menuId)
    return menu
  }

  @Subscription()
  orderUpdate() {
    return pubSub.asyncIterator('orderUpdate')
  }
}
