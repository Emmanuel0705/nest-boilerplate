import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum EGender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export class ISignUp {
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'Join@123',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'John@gmail.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '10-10-1990',
    required: true,
  })
  @IsString()
  dob: string;

  @ApiProperty({
    example: 'Canada',
    required: true,
  })
  @IsString()
  country: string;

  @ApiProperty({
    example: 'Toronto',
    required: true,
  })
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  phone: string;
}
export class emailDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class VerifyCodeDTO extends emailDto {
  @IsString()
  code: string;
}

export class loginDTO extends emailDto {
  @IsString()
  password: string;
}

export class resetPasswordDto {
  @IsString()
  password: string;
}

export class googleauthDto {
  @IsString()
  token: string;
}

export class googleSignInDto {
  @IsString()
  appleId: string;
}

export class IConfirmPasswordReset {
  @IsString()
  @MinLength(3)
  newPassword: string;

  @IsString()
  @MinLength(12)
  resetCode: string;
}

export class IVerifyOnboardingKYC {
  @IsString()
  kyc: string;

  @IsEmail()
  personalEmail: string;
}

export class IVerifyOnboardingHarsh {
  @IsString()
  harsh: string;
}

export class IVerifyUniEmailKYC {
  @IsString()
  kyc: string;

  @IsEmail()
  uniEmail: string;
}

export class IPasswordResetRequest {
  @IsString()
  @IsEmail()
  personalEmail: string;
}

export class IAdminPasswordResetRequest {
  @IsString()
  @IsEmail()
  workEmail: string;
}
export class IResendVerificationLink {
  @IsString()
  @IsEmail()
  personalEmail: string;
}
export class IResendUniEmailVerificationLink {
  @IsString()
  @IsEmail()
  uniEmail: string;
}

export interface IResetPasswordRedisParam {
  resetCode: string;
  userId: string;
  userEmail: string;
}

export enum EAUTH_HEADERS {
  AUTH_RESET_PASSWORD = 'XX-RS-PWD',
  AUTH_LOGIN_SESSION = 'xx-auth-access',
  SSO_AUTH_LOGIN_SESSION = 'xx-sso-auth-access',
}

export interface IAuthToken {
  auth: {
    id: string;
    metaData: {
      name?: string;
      email?: string;
    };
  };
}

export enum EAUTH_PARAMS {
  AUTH_META_TOKEN = 'AUTH_META_TOKEN',
}

export class IOnboardingBrand {
  @IsString()
  fullName: string;

  @IsString()
  country: string;

  @IsString()
  aboutBrand: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  officialEmail: string;

  @IsString()
  password: string;
}
export class CVerificationBrandAct {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  brandIds: string[];
}

export class CUpdateOnboardingBrand {
  @IsOptional()
  @IsString()
  country: string;

  @IsString()
  brandId: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  officialEmail: string;

  @IsOptional()
  @IsString()
  aboutBrand: string;
}
