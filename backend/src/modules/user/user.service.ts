import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../../entities/user.entity'
import { Repository, Not } from 'typeorm'
import { genSalt, hash, compare } from 'bcrypt'
import { InputRegister } from '../auth/inputs/register.input'
import * as jwtDecode from 'jwt-decode'
import { verify } from 'jsonwebtoken'
import { InputChangePassword } from 'src/graphql.schema'
import { jwtConstants } from '../auth/constants'
import { SessionInterface } from '../auth/interfaces/session.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userPepository: Repository<UserEntity>
  ) { }

  async create(userData: InputRegister): Promise<UserEntity> {
    const user = new UserEntity()
    if (userData.password !== userData.passwordCheck) throw new BadRequestException('Password and password check must be identical')
    const salt = await genSalt(10)
    const hashedPassword = await hash(userData.password, salt)

    user.username = userData.username
    user.password = hashedPassword

    return this.userPepository.save(user)
  }

  async findOne(username: string): Promise<UserEntity> {
    return this.userPepository.findOne({ username })
  }

  async findById(id: string): Promise<UserEntity> {
    return this.userPepository.findOne(id)
  }

  async decodeToken(token: string): Promise<SessionInterface> {
    // TODO:
    // Decode token để lấy object trong token
    const decoded = verify(token, jwtConstants.secret)
    const { userId, role } = decoded as SessionInterface
    return { userId, role }
  }

  async getAllUser(): Promise<UserEntity[]> {
    const users = await this.userPepository.find({
      where: { role: { $not: { $in: ['admin'] } } }
    })
    console.log(users)
    console.log('ok')
    return users
  }

  async changePassword(userId: string, userData: InputChangePassword): Promise<UserEntity> {
    const user = await this.userPepository.findOne(userId)
    console.log(user)
    const isPasswordValid = await compare(userData.password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException(
        'Password and password check must be identical',
      )
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(userData.newPassword, salt)
    user.password = hashedPassword
    return this.userPepository.save(user)
  }
}
