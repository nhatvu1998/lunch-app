import { Injectable, UnauthorizedException } from '@nestjs/common'
import { compare } from 'bcrypt'
import { UserEntity } from '../../entities/user.entity'
import { InputLogin } from './inputs/login.input'
import { UserService } from '../../modules/user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { InputRegister } from './inputs/register.input'
import { SessionInterface } from './interfaces/session.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async createUser(userData: InputRegister): Promise<UserEntity> {
    return this.userService.create(userData)
  }

  async createToken(userData: InputLogin): Promise<any> {
    const user = await this.userService.findOne(userData.username)
    if (!user) throw new UnauthorizedException('Invalid username or password')
    const isPasswordValid = await compare(userData.password, user.password)
    if (!isPasswordValid) { throw new UnauthorizedException('Invalid username or password') }

    const token = this.jwtService.sign({
      userId: user._id,
      role: user.role,
    })
    return { token }
  }
}
