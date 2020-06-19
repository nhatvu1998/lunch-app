import { Field, InputType } from 'type-graphql'
import { IsString, Length, Matches } from 'class-validator'

@InputType()
export class InputLogin {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  @Length(8, 255)
  password: string;
}
