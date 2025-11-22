import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";
import { SignupBodyDto } from "./auth.dto";
import { type ReqWithUser } from "src/lib/types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signup(@Body() body: SignupBodyDto) {
    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: ReqWithUser) {
    return this.authService.getToken(req.user.id, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: ReqWithUser) {
    return req.user;
  }
}
