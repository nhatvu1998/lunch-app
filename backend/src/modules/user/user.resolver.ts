import {
  Resolver, Mutation, Args, Query, Context
} from '@nestjs/graphql'
import { UserService } from './user.service'
import { UserEntity } from 'src/entities/user.entity'
import { Roles } from 'src/common/decorators/roles.decorator'
import { InputChangePassword } from '../../graphql.schema'

@Resolver('User')
// @UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Query()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUser()
  }

  @Mutation()
  @Roles('user')
  async changePassword(@Context() context, @Args('userData') userData: InputChangePassword): Promise<UserEntity> {
    const { userId } = context.user
    console.log(context.user)
    return await this.userService.changePassword(userId, userData)
  }
}
