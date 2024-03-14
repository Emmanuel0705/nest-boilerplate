import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin';
import { JwtModule } from '@nestjs/jwt';
import { Signal, SignalSchema } from 'src/models/signals';
import { Trade, TradeSchema } from 'src/models/trades';
import { Deposite, DepositeSchema } from 'src/models/deposits';
import { Withdraw, WithdrawSchema } from 'src/models/withdraws';
import { Invest, InvestSchema } from 'src/models/investment';
import { Plan, PlanSchema } from 'src/models/plans';
import { User, UserSchema } from 'src/models/users';
import { Bonus, BonusSchema } from 'src/models/bonus';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60d' },
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Signal.name, schema: SignalSchema },
      { name: Trade.name, schema: TradeSchema },
      { name: Deposite.name, schema: DepositeSchema },
      { name: Withdraw.name, schema: WithdrawSchema },
      { name: Invest.name, schema: InvestSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: User.name, schema: UserSchema },
      { name: Bonus.name, schema: BonusSchema },
    ]),
    AuthModule,
  ],
})
export class AdminModule {}
