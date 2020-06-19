import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { DishModule } from './modules/dish/dish.module'
import { GraphQLModule } from '@nestjs/graphql'
import { UserModule } from './modules/user/user.module'
import { join } from 'path'
import { AuthModule } from './modules/auth/auth.module'
import { SiteModule } from './modules/site/site.module'
import { ShopService } from './modules/shop/shop.service'
import { ShopResolver } from './modules/shop/shop.resolver'
import { ShopModule } from './modules/shop/shop.module'
import { MenuModule } from './modules/menu/menu.module'
import { OrderModule } from './modules/order/order.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      database: 'lunchtest',
      url: `mongodb://localhost:${process.env.MONGO}`,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    }),
    DishModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          console.log(connection.context)
          // return connection.context;
        }
        return ({ req })
      },
      subscriptions: {
        onConnect: (connectionParams, webSocket) => {
          console.log(connectionParams)
          // if (connectionParams.authToken) {
          //   return validateToken(connectionParams.authToken)
          //     .then(findUser(connectionParams.authToken))
          //     .then((user) => ({
          //       currentUser: user,
          //     }))
          // }

          // throw new Error('Missing auth token!')
        }
      }
    }), UserModule, AuthModule, SiteModule, ShopModule, MenuModule, OrderModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
