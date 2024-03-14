import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum REG_TYPE {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  dob: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  sex: GENDER;

  @Prop({ type: String, default: 'EMAIL', enum: REG_TYPE, transform: String })
  regType: REG_TYPE;

  @Prop({ default: false, type: Boolean })
  emailVerified: boolean;

  @Prop({
    type: {
      code: { type: String },
      expired: { type: Date },
    },
  })
  verification: {
    code: string;
    expired: string | Date;
  };

  @Prop({ type: String })
  profilePic: string;

  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User).set('toJSON', {
  virtuals: true,
});
