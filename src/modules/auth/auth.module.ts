import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/users';
import { Mailer } from 'src/vendors/email';

config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, Mailer],
  exports: [AuthService],
})
export class AuthModule {}
