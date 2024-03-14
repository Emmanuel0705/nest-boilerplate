import {
  Post,
  Req,
  Res,
  Body,
  Controller,
  Version,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import {
  emailDto,
  ISignUp,
  loginDTO,
  resetPasswordDto,
  VerifyCodeDTO,
} from './auth.dto';
import { config } from 'dotenv';
import { User } from 'src/models/users';
import { AuthGuard } from 'src/guards/auth';
import { LowerCaseEmailGuard } from 'src/guards/emailNormalize';
import { EServerVersions } from 'src/utils/constant';
import { ApiTags } from '@nestjs/swagger';

config();

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // super();
  }

  @Version(`${EServerVersions.V1}`)
  @Post('sign-up')
  @UseGuards(LowerCaseEmailGuard)
  async signUp(@Res() res: Response, @Body() body: ISignUp) {
    console.log(body.email);
    const result = await this.authService.signUp(body);

    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('verify-code')
  @UseGuards(LowerCaseEmailGuard)
  async verifyCode(@Res() res: Response, @Body() body: VerifyCodeDTO) {
    const result = await this.authService.verifyCode(body);

    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('send-code')
  @UseGuards(LowerCaseEmailGuard)
  async sendCode(@Res() res: Response, @Body() body: emailDto) {
    const result = await this.authService.sendVerificationCode(body.email);
    res.status(result.statusCode).send(result);
  }
  @Version(`${EServerVersions.V1}`)
  @Post('login')
  @UseGuards(LowerCaseEmailGuard)
  async login(@Res() res: Response, @Body() body: loginDTO) {
    const result = await this.authService.login(body);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(AuthGuard)
  @Version(`${EServerVersions.V1}`)
  @Post('reset-password')
  async resetPassword(
    @Req() req: Request & { user: User },
    @Res() res: Response,
    @Body() body: resetPasswordDto,
  ) {
    const result = await this.authService.resetPassword(
      req.user._id,
      body.password,
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(AuthGuard)
  @Version(`${EServerVersions.V1}`)
  @Get('me')
  async authUser(@Req() req: Request & { user: User }, @Res() res: Response) {
    res.status(200).send({ status: true, data: req.user });
  }
}
