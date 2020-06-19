import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AccessTokenDto } from './interfaces/access-token.interface'
import { InputLogin, InputRegister } from '../../graphql.schema'
import { UserEntity } from '../../entities/user.entity'
import { AuthService } from './auth.service'
import { Public } from 'src/common/decorators/public.decorator'


@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Mutation(() => UserEntity)
  async register(@Args('userData') userData: InputRegister) {
    const user = await this.authService.createUser(userData)
    return user
  }

  @Mutation(() => AccessTokenDto)
  @Public()
  async login(@Args('userData') userData: InputLogin) {
    return this.authService.createToken(userData)
  }
}
