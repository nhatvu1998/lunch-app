import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { RoleGuard } from './common/guard/role.guard'
import { UserService } from './modules/user/user.service'
import { JwtAuthGuard } from './common/guard/jwt-auth.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalGuards(
    new RoleGuard(app.get(Reflector), app.get(UserService)),
    // new JwtAuthGuard(app.get(Reflector)),
  )
  await app.listen(process.env.APP)
  console.log(`Server is listening on port ${process.env.APP}`)
}
bootstrap()
