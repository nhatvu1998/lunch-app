import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
// import { JwtStrategy } from './jwt-strategy.service';
import { UserService } from 'src/modules/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { RolesGaurd } from './gaurd/roles.gaurd';
import { AuthResolver } from './auth.resolver'
import { UserEntity } from '../../entities/user.entity'
import { JwtStrategy } from './jwt.strategy'
import { jwtConstants } from './constants'
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy, AuthResolver, JwtAuthGuard],
})
export class AuthModule { }
