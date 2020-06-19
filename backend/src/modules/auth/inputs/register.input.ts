import { Field, InputType } from 'type-graphql'
import { IsString, Length, Matches } from 'class-validator'

@InputType()
export class InputRegister {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  @Length(8, 20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' },
  )
  password: string;

  @Field()
  @IsString()
  @Length(8, 255)
  passwordCheck: string;
}
