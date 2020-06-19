import {
  Resolver,
  Query,
  Context,
  Mutation,
  Args,
} from '@nestjs/graphql'
import { Dish, DishInput } from '../../graphql.schema'
import { Roles } from '../../common/decorators/roles.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import { DishService } from './dish.service'

@Resolver()
export class DishResolvers {
  constructor(
    private readonly dishService: DishService
  ) { }

  @Query()
  @Roles('user')
  async dishes(@Context() context): Promise<Dish[]> {
    return this.dishService.findAll()
  }

  @Mutation()
  async addDish(@Context() context, @Args('dish') dish: DishInput): Promise<Dish> {
    return this.dishService.addDish(dish)
  }
}
