import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class SignupDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "username can only contain letters, numbers, and underscores",
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
