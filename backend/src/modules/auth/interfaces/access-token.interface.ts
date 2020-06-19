import { IsString } from 'class-validator'

export class AccessTokenDto {
  @IsString()
  token: string;
}
