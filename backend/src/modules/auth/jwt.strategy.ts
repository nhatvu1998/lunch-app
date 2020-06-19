import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { SessionInterface } from './interfaces/session.interface'
import { UserService } from '../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    })
  }

  async validate(payload: JwtPayload): Promise<SessionInterface> {
    const user = await this.userService.findOne(payload.username)
    if (!user) {
      throw new UnauthorizedException('Invalid username or password')
    }

    return {
      userId: user._id,
      role: user.role,
    }
  }
}
