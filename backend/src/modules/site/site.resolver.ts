import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SiteService } from './site.service';
import { InputCreateSite } from 'src/graphql.schema';
import { ShopEntity } from 'src/entities/shop.entity';
import { ShopService } from '../shop/shop.service';

@Resolver('Site')
export class SiteResolver {
  constructor(
    private readonly siteService: SiteService,
    private readonly shopService: ShopService
  ) { }

  @Query()
  async sites() {
    return await this.siteService.findAll()
  }

  @Query()
  @Roles('admin')
  async site(@Args('id') id: string) {
    return await this.siteService.findOne(id)
  }

  @Mutation()
  // @Roles('admin')
  async createSite(@Args('data') data: InputCreateSite) {
    return await this.siteService.createSite(data)
  }

  @Mutation()
  // @Roles('admin')
  async deleteSite(@Args('id') id: string) {
    const abc = await this.siteService.deleteSite(id)
    return abc
  }

  @ResolveProperty('shops', () => [ShopEntity])
  async shops(@Parent() site) {
    return await this.shopService.find(site._id)
  }
}
