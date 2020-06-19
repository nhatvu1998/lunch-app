import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteEntity } from 'src/entities/site.entity';
import { InputCreateSite } from 'src/graphql.schema';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteRepository: Repository<SiteEntity>
  ) { }

  async findAll(): Promise<SiteEntity[]> {
    return this.siteRepository.find({})
  }

  async findOne(id: string): Promise<SiteEntity> {
    return await this.siteRepository.findOne(id)
  }

  async createSite(data: InputCreateSite): Promise<SiteEntity> {
    const { name } = data
    const site = new SiteEntity({ name })
    return await this.siteRepository.save(site)
  }

  async deleteSite(id: string): Promise<SiteEntity> {
    const site = await this.siteRepository.findOne(id)
    if (!site) throw new NotFoundException('Site not found')
    return await this.siteRepository.remove(site);
  }
}
