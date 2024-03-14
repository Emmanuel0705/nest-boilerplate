import { HttpStatus, Injectable } from '@nestjs/common';
import { ISignUp, loginDTO, VerifyCodeDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';

import ErrorHandlerX, {
  addMinutesToCurrentTime,
  hashString,
  IRes,
  resError,
  resSuccess,
  unhashString,
} from '../../utils/helpers';

import { JwtService } from '@nestjs/jwt';

import { REG_TYPE, User } from 'src/models/users';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TEMPLATES } from 'src/templates';
import { Mailer } from 'src/vendors/email';

@Injectable()
export class AuthService {
  BCRYPT_SALT: number | string = 12;

  async hashData(dt: string): Promise<string> {
    return await bcrypt.hash(dt, this.BCRYPT_SALT);
  }

  async compareHashData({
    hash,
    str,
  }: {
    hash: string;
    str: string;
  }): Promise<boolean> {
    return await bcrypt.compare(str, hash);
  }

  constructor(
    @InjectModel(User.name) private User: Model<User>,
    private jwt: JwtService,
    private readonly mailer: Mailer,
  ) {
    // super();
  }

  async signUp(body: ISignUp): Promise<IRes<User>> {
    try {
      let user = await this.User.findOne({ email: body.email });

      if (user) {
        throw new ErrorHandlerX({
          message: `This user already exist, Please procceed to login `,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // hash password
      body.password = await this.hashData(body.password);

      // generate code
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const hashedCode = hashString(code);
      const expired = addMinutesToCurrentTime(10);

      const verification = {
        code: hashedCode,
        expired,
      };

      user = new this.User({ ...body, verification });

      await user.save();

      // send verification email
      this.mailer.sendEmail([body.email], {
        template: TEMPLATES.SEND_OTP,
        data: { code, user: body.firstName },
        title: 'Welcome to NMR',
      });
      // console.log({ user });

      return resSuccess({
        message:
          'Congratulations! Verification code has been sent to your email',
        data: user,
      });
    } catch (e) {
      return resError(e);
    }
  }

  async sendVerificationCode(email: string): Promise<IRes<User>> {
    try {
      const user = await this.User.findOne({ email });

      if (!user) {
        throw new ErrorHandlerX({
          message: `User with this email address does not exist`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // generate code
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const hashedCode = hashString(code);
      const expired = addMinutesToCurrentTime(10);

      user.verification = {
        code: hashedCode,
        expired,
      };

      await user.save();

      // send verification email
      this.mailer.sendEmail([email], {
        template: TEMPLATES.SEND_OTP,
        data: { code, user: user.firstName },
        title: 'Verification Code',
      });

      return resSuccess({
        message: 'Verification Code has been sent to your email',
      });
    } catch (e) {
      return resError(e);
    }
  }

  async verifyCode(body: VerifyCodeDTO): Promise<IRes<any>> {
    const { code, email } = body;
    try {
      const user = await this.User.findOne({ email });

      if (!user) {
        throw new ErrorHandlerX({
          message: `User with this email address does not exist`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const valid = unhashString(user.verification.code, code);

      if (!valid) {
        throw new ErrorHandlerX({
          message: `Invalid Verification code`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const expiredTime = new Date(user.verification.expired).toTimeString();
      const currentTime = new Date().toTimeString();

      if (currentTime > expiredTime) {
        throw new ErrorHandlerX({
          message: `Verification Code has expired`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      user.verification = {
        code: '',
        expired: '',
      };

      user.emailVerified = true;

      await user.save();

      const token = await this.jwt.signAsync({ id: user._id });

      return resSuccess({
        message: 'Verified',
        data: user,
        token,
      });
    } catch (e) {
      return resError(e);
    }
  }

  async resetPassword(userId: ObjectId, password: string): Promise<IRes<any>> {
    try {
      const user = await this.User.findOne({ _id: userId });

      if (!user) {
        throw new ErrorHandlerX({
          message: `User not found`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // hash password
      const hashedPassword = await this.hashData(password);

      user.password = hashedPassword;

      await user.save();

      return resSuccess({
        message: 'Password has been reset successfully',
        data: {},
      });
    } catch (e) {
      return resError(e);
    }
  }

  async login(body: loginDTO): Promise<IRes<any>> {
    try {
      const user = await this.User.findOne({ email: body.email });

      if (!user) {
        throw new ErrorHandlerX({
          message: `Invalid login details`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (user.regType != REG_TYPE.EMAIL) {
        throw new ErrorHandlerX({
          message: `Please signIn with ${user.regType} authentication `,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // hash password
      const validPassword = await this.compareHashData({
        hash: user.password,
        str: body.password,
      });

      if (!validPassword) {
        throw new ErrorHandlerX({
          message: `Invalid login details`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const token = await this.jwt.signAsync({ id: user._id });

      return resSuccess({
        message: 'LoggedIn successfully',
        data: user,
        token,
      });
    } catch (e) {
      return resError(e);
    }
  }
}
