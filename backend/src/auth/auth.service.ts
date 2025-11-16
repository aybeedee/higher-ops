import { Injectable, ConflictException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "prisma/prisma.service";
import { User } from "generated/prisma/client";
import bcrypt from "bcryptjs";
import { SignupDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getToken(user: Omit<User, "password">) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signup(signupDto: SignupDto) {
    const { username, password: plainPassword } = signupDto;

    const existingUser = await this.usersService.findOne({ username });
    if (existingUser) throw new ConflictException("Username already exists");

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await this.prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const { password, ...result } = user;
    return await this.getToken(result);
  }
}
