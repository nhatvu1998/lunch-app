import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { OrderEntity } from 'src/entities/order.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getMongoRepository } from 'typeorm'
import { MenuService } from '../menu/menu.service'
import { MenuEntity } from 'src/entities/menu.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly menuService: MenuService,
  ) { }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({})
  }

  async findByUserId(userId: string) {
    const order = await this.orderRepository.findOne({ userId })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return order
  }

  async findByMenuId(menuId: string): Promise<OrderEntity[]> {
    const order = await this.orderRepository.find({ menuId })
    console.log(order)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return order
  }

  async createOrder(dishId: string, userId: string, menuId: string): Promise<OrderEntity> {
    // const { dishId, userId, menuId } = input
    console.log(dishId)
    console.log(userId)
    // console.log(menuId)
    const orderExit = await this.orderRepository.findOne({ userId })

    console.log(orderExit)

    const menu = await this.menuService.findById(menuId)
    if (!menu) {
      throw new NotFoundException('Menu not found')
    }

    const index = menu.dishes.findIndex((dish) => dish._id === dishId)

    // if (menu.dishes[index].orderCount === menu.dishes[index].count) {
    //   throw new BadRequestException('Het so luong')
    // }
    // if (menu.dishes[index].count === 0) {
    //   throw new BadRequestException('So luong la 0')
    // }
    menu.dishes[index].orderCount++
    await getMongoRepository(MenuEntity).save(menu)
    if (orderExit) {
      orderExit.count++
      return this.orderRepository.save(orderExit)
    }
    const order = new OrderEntity({
      dishId,
      userId,
      menuId,
      count: 1
    })
    return this.orderRepository.save(order)
  }

  async deleteOrder(dishId: string, userId: string): Promise<Boolean> {
    const order = await this.orderRepository.findOne({ userId })
    console.log(order)
    const menu = await this.menuService.findById(order.menuId)
    if (!menu) {
      throw new NotFoundException('Menu not found')
    }
    const index = menu.dishes.findIndex((dish) => dish._id === dishId)

    // if (menu.dishes[index].orderCount === menu.dishes[index].count) {
    //   throw new BadRequestException('Het so luong')
    // }
    // if (menu.dishes[index].count === 0) {
    //   throw new BadRequestException('So luong la 0')
    // }
    menu.dishes[index].orderCount--
    await getMongoRepository(MenuEntity).save(menu)
    await this.orderRepository.remove(order)
    return true
  }

  async addNote(input: string, userId): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ userId })
    order.note = input
    return this.orderRepository.save(order)
  }

  async confirmEat(userId): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ userId })
    console.log(order)
    order.isConfirmed = true
    return this.orderRepository.save(order)
  }
}
