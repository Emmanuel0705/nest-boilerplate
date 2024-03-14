import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { ISliderDeals } from '../../lib';
import { IAdminStudentVerificationReminder } from '../../lib';
import { IsOptional } from 'class-validator';
import { GENDER, ROLES } from 'src/models/admin';

export class CAmdinStudentVerifyRemider
  implements IAdminStudentVerificationReminder
{
  @IsString() studentEmail: string;
}

export class CSliderDeals implements Partial<ISliderDeals> {
  @IsString() mainTitle: string;
  @IsString() subTitle: string;
  @IsString() cropDescription: string;
  @IsString() brandId: string;
  @IsString() dealUrl: string;
}

export class CUpdateSliderDeals extends CSliderDeals {
  @IsString() _id: string;
}

export class CDeleteSliderDeals {
  @IsString() sliderDealId: string;
}

export class IAdminOnboarding {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsEnum(GENDER)
  @IsOptional()
  sex: GENDER;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES;
}
export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CDepositDTO {
  @IsNumber()
  amount: number;
}

export class FundWalletDTO {
  @IsNumber()
  amount: number;

  @IsEmail()
  email: string;
}

export class CWithdrawDto {
  @IsNumber()
  amount: number;
}

export class CreateSignalDto {
  @IsString()
  symbol: string;

  @IsArray()
  duration: string[];

  @IsArray()
  type: string[];
}

export class UpdateDTO {
  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsEnum(GENDER)
  sex: GENDER;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  password: string;
}
export class EditDealDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  photoUrl: string;

  @IsString()
  @IsOptional()
  timeLine: string;

  @IsOptional()
  @IsString()
  duration: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  dealType: string;

  @IsString()
  @IsOptional()
  isDealDraft: string;

  @IsString()
  @IsOptional()
  affiliateUrl: string;

  @IsString()
  @IsOptional()
  codeType: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  termsAndCondition: string;

  @IsString()
  @IsOptional()
  liveEndDate: string;

  @IsString()
  @IsOptional()
  liveStartDate: string;

  @IsString()
  @IsOptional()
  brandId: string;
}

export class CreateDealDTO {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  photoUrl: string;

  @IsString()
  timeLine: string;

  @IsOptional()
  @IsString()
  duration: string;

  @IsString()
  description: string;

  @IsString()
  dealType: string;

  @IsString()
  @IsOptional()
  isDealDraft: string;

  @IsString()
  @IsOptional()
  affiliateUrl: string;

  @IsString()
  codeType: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  termsAndCondition: string;

  @IsString()
  @IsOptional()
  liveEndDate: string;

  @IsString()
  @IsOptional()
  liveStartDate: string;

  @IsString()
  @IsOptional()
  brandName: string;

  @IsString()
  @IsOptional()
  brandPicsUrl: string;

  @IsString()
  @IsOptional()
  brandId: string;
}

export class IReviewStudentVerification {
  @IsString()
  studentId: string;

  @IsBoolean()
  isApproved: boolean;
}
