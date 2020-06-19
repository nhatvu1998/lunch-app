import { Module } from '@nestjs/common';
import { SiteResolver } from './site.resolver';
import { SiteService } from './site.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from 'src/entities/site.entity';
import { ShopService } from '../shop/shop.service';
import { ShopEntity } from 'src/entities/shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteEntity, ShopEntity]),],
  providers: [SiteResolver, SiteService, ShopService]
})
export class SiteModule { }
