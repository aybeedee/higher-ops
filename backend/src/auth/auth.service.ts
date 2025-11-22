import { Injectable, ConflictException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import bcrypt from "bcryptjs";
import { SignupBodyDto } from "./auth.dto";

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

  async getToken(id: number, username: string) {
    const payload = { sub: id, username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signup(body: SignupBodyDto) {
    const { username, password: plainPassword } = body;

    const existingUser = await this.usersService.findOne({ username });
    if (existingUser) throw new ConflictException("Username already exists");

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await this.prisma.user.create({
      data: { username, password: hashedPassword },
    });

    return await this.getToken(user.id, user.username);
  }
}
