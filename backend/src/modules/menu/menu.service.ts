/* eslint-disable max-len */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MenuEntity } from 'src/entities/menu.entity'
import { Repository } from 'typeorm'
import {
  InputCreateMenu, InputAddDish, FileInput, Menu, DishMenuInput
} from 'src/graphql.schema'
import { DishService } from '../dish/dish.service'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    private readonly dishService: DishService
  ) { }

  async findAll(): Promise<MenuEntity[]> {
    return this.menuRepository.find({})
  }

  async findById(id: string): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne(id)
    return menu
  }

  async findBySiteId(siteId: string): Promise<MenuEntity[]> {
    const menu = await this.menuRepository.find({ where: { siteId: siteId.toString() } })
    console.log(menu)
    return menu
  }

  async create(data: InputCreateMenu): Promise<MenuEntity> {
    const {
      name, siteId, shopId, dishes
    } = data
    console.log(data)
    const menu = new MenuEntity({
      name, siteId, shopId, dishes
    })
    console.log(menu)
    return this.menuRepository.save(menu)
  }

  async addDishes(data: InputAddDish): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne(data.menuId)
    menu.dishes.push(...data.dishes)
    return this.menuRepository.save(menu)
  }

  // eslint-disable-next-line max-len
  async import(id: string, shopId: string, fileInput: FileInput[], siteId: string): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne(id)
    console.log(fileInput)
    const dishes = await Promise.all(fileInput.map(async (item) => {
      const res = await this.dishService.addDish({ name: item.name, shopId })
      console.log(res)
      return {
        _id: res._id,
        name: res.name,
        count: item.count
      }
    }))
    console.log(dishes)
    menu.shopId = shopId
    menu.dishes = dishes
    return this.menuRepository.save(menu)
  }

  async publish(id: string): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne(id)
    menu.isPublish = !menu.isPublish
    return this.menuRepository.save(menu)
  }

  async findPublishMenuBySiteId(siteId: string): Promise<MenuEntity[]> {
    const menu = await this.menuRepository.find({ where: { siteId: siteId.toString(), isPublish: true } })
    return menu
  }

  async lockMenu(siteId: string): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne({ where: { siteId: siteId.toString(), isPublish: true } })
    if (!menu) throw new NotFoundException('Menu not found')
    menu.isLocked = !menu.isLocked
    return this.menuRepository.save(menu)
  }

  async updateOrder(menuId: string, dishes: [DishMenuInput]): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne(menuId)
    menu.dishes = dishes
    console.log(menu)
    return this.menuRepository.save(menu)
  }
}
