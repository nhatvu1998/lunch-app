import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { SessionInterface } from 'src/modules/auth/interfaces/session.interface'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserService } from 'src/modules/user/user.service'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles || roles.length === 0) return true
    console.log(roles)
    try {
      const gqlCtx = GqlExecutionContext.create(context)
      const { authorization } = gqlCtx.getContext().req.headers
      if (!authorization) return false
      console.log(authorization)
      const res = await this.userService.decodeToken(authorization)
      // console.log(res.role)
      // console.log(roles[0])
      if (roles.includes(res.role) === false) {
        return false
      }
      gqlCtx.getContext().user = { userId: res.userId, role: res.role }
      return true
    } catch (err) {
      return false
    }
  }
}
