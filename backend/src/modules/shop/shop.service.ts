import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ShopEntity } from 'src/entities/shop.entity'
import { InputCreateShop } from 'src/graphql.schema'
import { Repository } from 'typeorm'

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>
  ) { }

  async findAll(): Promise<ShopEntity[]> {
    return this.shopRepository.find({})
  }

  async findOne(id: string): Promise<ShopEntity> {
    return this.shopRepository.findOne(id)
  }

  async find(id: string): Promise<ShopEntity[]> {
    return this.shopRepository.find({ where: { siteId: id.toString() } })
  }

  async createShop(data: InputCreateShop): Promise<ShopEntity> {
    const { name, siteId } = data
    console.log(data)
    const shop = new ShopEntity({ name, siteId })
    console.log(shop)
    return this.shopRepository.save(shop)
  }

  async deleteShop(id: string): Promise<ShopEntity> {
    const shop = await this.shopRepository.findOne(id)
    if (!shop) throw new NotFoundException('Shop not found')
    return this.shopRepository.remove(shop)
  }

  async update(id: string, newName: string): Promise<ShopEntity> {
    const shop = await this.shopRepository.findOne(id)
    console.log(shop)
    if (!shop) throw new NotFoundException('Shop not found')
    shop.name = newName
    return this.shopRepository.save(shop)
  }
}
