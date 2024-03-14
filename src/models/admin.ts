import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type AdminDocument = Admin & Document;

export enum LANGUAGE {
  EN = 'en',
  AR = 'ar',
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ROLES {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}

@Schema({ timestamps: true })
export class Admin {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  sex: GENDER;

  @Prop({ type: String, default: 'ADMIN', enum: ROLES })
  role: ROLES;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  workEmail: string;

  @Prop({ default: false, type: Boolean })
  verified: boolean;

  @Prop({ default: true, type: Boolean })
  active: boolean;

  @Prop({ type: String })
  profilePic: string;

  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
