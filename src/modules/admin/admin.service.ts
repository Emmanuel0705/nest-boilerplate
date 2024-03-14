import { HttpStatus, Injectable } from '@nestjs/common';
import ErrorHandlerX, { resError, resSuccess } from '../../utils/helpers';
import { RootmService } from '../rootm/rootm.service';
import { InjectModel } from '@nestjs/mongoose';
import { config } from 'dotenv';
import mongoose, { Model } from 'mongoose';
import { Admin, ROLES } from '../../models/admin';
import {
  CDepositDTO,
  CreateSignalDto,
  CWithdrawDto,
  FundWalletDTO,
  IAdminOnboarding,
  LoginDTO,
  UpdateDTO,
} from './index.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Deposite, Deposite_TYPE } from 'src/models/deposits';
import { Trade } from 'src/models/trades';
import { WALLET_TYPE, Withdraw, Withdraw_TYPE } from 'src/models/withdraws';
import { Invest, InvestSchema, STATUS } from 'src/models/investment';
import { Plan } from 'src/models/plans';
import { Signal } from 'src/models/signals';
import { User } from 'src/models/users';
import { Bonus } from 'src/models/bonus';
import { Cron, CronExpression } from '@nestjs/schedule';

config();
@Injectable()
export class AdminService extends RootmService {
  constructor(
    @InjectModel(Admin.name)
    private Admin: Model<Admin>,
    private jwt: JwtService,
    @InjectModel(Trade.name) private Trade: Model<Trade>,
    @InjectModel(Deposite.name) private Deposit: Model<Deposite>,
    @InjectModel(Withdraw.name) private Withdraw: Model<Withdraw>,
    @InjectModel(Invest.name) private Invest: Model<Invest>,
    @InjectModel(Plan.name) private Plan: Model<Plan>,
    @InjectModel(Signal.name) private Signal: Model<Signal>,
    @InjectModel(User.name) private User: Model<User>,
    @InjectModel(Bonus.name) private Bonus: Model<Bonus>,
  ) {
    super();
  }
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

  getProfit(name: string) {
    if (name === 'BRONZE') return 0.1;
    if (name === 'SILVER') return 0.15;
    if (name === 'GOLD') return 0.2;
    if (name === 'PLATINUM') return 0.25;
    return 0.1;
  }

  //@cron
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleCron() {
    console.log('Called when the current second is 45');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const investment = await this.Invest.find({
      $and: [{ status: 'PENDING' }, { updatedAt: { $lte: sevenDaysAgo } }],
    });

    investment.forEach(async (doc) => {
      const result = await this.Invest.findById(doc._id);
      //check the created date

      // Calculate the date 2 months ago
      const lockUpTime = new Date();
      lockUpTime.setMonth(lockUpTime.getMonth() - result.duration);

      if (result.createdAt <= lockUpTime) {
        result.status = STATUS.COMPLETED;
      }
      result.updatedAt = new Date();
      result.save();
      const profit =
        result.amount * this.getProfit(result?.name?.toUpperCase());
      console.log({ profit });
      const user = await this.User.findById(result.user);
      user.tradeWallet = user.tradeWallet + profit;
      user.save();

      const bonus = new this.Bonus({ user: user._id, amount: profit });
      bonus.save();
    });
  }

  async createAdmin(payload: IAdminOnboarding) {
    try {
      console.log('LOG');
      let admin = await this.Admin.findOne({ email: payload.email });
      if (admin) {
        throw new ErrorHandlerX({
          message: `Email already exist`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      // hash password
      payload.password = await this.hashData(payload.password);

      admin = new this.Admin({ ...payload, verified: true });
      admin.save();
      return resSuccess({
        message: 'New admin created successfully ',
        data: null,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }
  async createSignal(payload: CreateSignalDto) {
    try {
      const signal = new this.Signal({ ...payload });
      signal.save();
      return resSuccess({
        message: 'Signal Created',
        data: signal,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async fund(payload: FundWalletDTO) {
    try {
      const user = await this.User.findOne({ email: payload.email });

      user.mainWallet = user.mainWallet + payload.amount;
      await user.save();

      return resSuccess({
        message: ` FUNDED `,
        data: user,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getSignals(query: any) {
    try {
      const signals = await this.Signal.find(query).sort({
        createdAt: -1,
      });

      return resSuccess({
        message: 'Signal Created',
        data: signals,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async deleteSignal(id: any) {
    try {
      const signal = await this.Signal.findById(id);

      if (!signal) {
        throw new ErrorHandlerX({
          message: `Signal not found`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      await signal.delete();

      return resSuccess({
        message: 'Signal Deleted',
        data: {},
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getTrades(query: any) {
    try {
      const data = await this.Trade.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'Signal Created',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getDeposit(query: any) {
    try {
      const data = await this.Deposit.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'Signal Created',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async approveDeposit(id: string, body: CDepositDTO) {
    try {
      const data = await this.Deposit.findById(id);

      if (!data) {
        throw new ErrorHandlerX({
          message: `Invalid Deposit Id`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const user = await this.User.findById(data.user);
      // approved
      data.status = Deposite_TYPE.APPROVED;
      data.amount = body.amount;
      data.save();

      // crediting
      user.mainWallet = user.mainWallet + body.amount;
      user.save();

      if (user.referredBy) {
        let bonus = await this.Bonus.findOne({ referral: user._id });

        if (!bonus) {
          const beneficiary = await this.User.findOne({
            referralCode: user.referredBy,
          });

          const bonusAmount = body.amount * 0.05;
          bonus = new this.Bonus({
            amount: bonusAmount,
            user: beneficiary._id,
            referral: user._id,
          });
          bonus.save();
          beneficiary.mainWallet = beneficiary.mainWallet + bonusAmount;
          beneficiary.save();
        }
      }

      return resSuccess({
        message: 'Deposit Approved',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async declineDeposit(id: string) {
    try {
      const data = await this.Deposit.findById(id);

      if (!data) {
        throw new ErrorHandlerX({
          message: `Invalid Deposit Id`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // approved
      data.status = Deposite_TYPE.DELINED;
      data.save();

      return resSuccess({
        message: 'Deposit Declined',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async approveWithdraw(id: string, body: CWithdrawDto) {
    try {
      const data = await this.Withdraw.findById(id);

      if (!data) {
        throw new ErrorHandlerX({
          message: `Invalid Withdraw Id`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // approved
      data.status = Withdraw_TYPE.APPROVED;
      data.amount = body.amount;
      data.save();

      // debiting
      // const user = await this.User.findById(data.user);
      // user.mainWallet = user.mainWallet - body.amount;
      // user.save();

      return resSuccess({
        message: 'Withdraw Approved',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async declineWithdraw(id: string) {
    try {
      const data = await this.Withdraw.findById(id);

      if (!data) {
        throw new ErrorHandlerX({
          message: `Invalid Withdraw Id`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // decline
      data.status = Withdraw_TYPE.DELINED;
      data.save();

      // crediting
      const user = await this.User.findById(data.user);
      if (data.wallet === WALLET_TYPE.MAIN) {
        user.mainWallet = user.mainWallet + data.amount;
        user.save();
      }

      //
      if (data.wallet === WALLET_TYPE.TRADING) {
        user.tradeWallet = user.tradeWallet + data.amount;
        user.save();
      }

      return resSuccess({
        message: 'Withdraw Declined',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getWitdraw(query: any) {
    try {
      const data = await this.Withdraw.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'RETRIVED',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getBonus(query: any) {
    try {
      const data = await this.Bonus.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'RETRIVED',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getPlans(query: any) {
    try {
      const data = await this.Plan.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'RETRIVED',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getInvestments(query: any) {
    try {
      const data = await this.Invest.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'RETRIVED',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }

  async getTrade(query: any) {
    try {
      const data = await this.Trade.find(query)
        .populate('user', 'fullName email')
        .sort({
          createdAt: -1,
        });

      return resSuccess({
        message: 'RETRIVED',
        data: data,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }
  async createSPAdmin() {
    try {
      // await this.Admin.deleteMany();
      const payload = {
        email: 'super_admin@exnesstrad.com',
        password: 'admin_123',
        name: 'SUPER ADMIN',
      };
      let admin = await this.Admin.findOne({ email: payload.email });
      if (admin) {
        throw new ErrorHandlerX({
          message: `Email already exist`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      // hash password
      payload.password = await this.hashData(payload.password);

      admin = new this.Admin({
        ...payload,
        verified: true,
        role: ROLES.SUPER_ADMIN,
      });
      admin.save();
      return resSuccess({
        message: 'New admin created successfully ',
        data: null,
      });
    } catch (e) {
      console.error(e);
      return resError(e);
    }
  }
  async login(payload: LoginDTO) {
    try {
      const admin = await this.Admin.findOne({ email: payload.email });
      if (!admin) {
        throw new ErrorHandlerX({
          message: `Invalid login details`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (!admin.verified) {
        throw new ErrorHandlerX({
          message: `Not yet verified`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      // hash password
      const validPassword = await this.compareHashData({
        hash: admin.password,
        str: payload.password,
      });

      if (!validPassword) {
        throw new ErrorHandlerX({
          message: `Invalid login details`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const token = await this.jwt.signAsync({ id: admin._id });

      return resSuccess({
        message: 'AUthenticated ',
        data: admin,
        token,
      });
    } catch (e) {
      return resError(e);
    }
  }

  async allAdmin() {
    try {
      const admin = await this.Admin.find();

      return resSuccess({
        message: 'fetched',
        data: admin,
      });
    } catch (e) {
      return resError(e);
    }
  }

  async allUser() {
    try {
      const user = await this.User.find().sort({
        createdAt: -1,
      });

      return resSuccess({
        message: 'fetched',
        data: user,
      });
    } catch (e) {
      return resError(e);
    }
  }
  async getAdmin(_id: string) {
    try {
      const id = new mongoose.Types.ObjectId(_id);
      console.log({ id });
      const admin = await this.Admin.findById({ _id: id });
      console.log(admin);
      return resSuccess({
        message: 'fetched',
        data: admin,
      });
    } catch (e) {
      return resError(e);
    }
  }
  async deleteAdmin(_id: string) {
    try {
      const id = new mongoose.Types.ObjectId(_id);
      const admin = await this.Admin.findOne({ _id: id });

      if (!admin) {
        throw new ErrorHandlerX({
          message: `Admin with this ID is not found`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (admin.role === ROLES.SUPER_ADMIN) {
        throw new ErrorHandlerX({
          message: `Sorry you can't delete super admin`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const deleteAdmin = await this.Admin.deleteOne({ _id: id });
      console.log({ deleteAdmin });

      return resSuccess({
        message: 'Admin Deleted',
        data: null,
      });
    } catch (e) {
      return resError(e);
    }
  }
  async verifyAdmin(_id: string) {
    try {
      const id = new mongoose.Types.ObjectId(_id);
      const admin = await this.Admin.findOne({ _id: id });
      // console.log({ admin });
      if (!admin) {
        throw new ErrorHandlerX({
          message: `Admin with this ID is not found`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (admin.verified) {
        throw new ErrorHandlerX({
          message: `Account has already been verified`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      admin.verified = true;
      // admin.role = ROLES.SUPER_ADMIN;

      admin.save();
      return resSuccess({
        message: 'Account Verified',
        data: null,
      });
    } catch (e) {
      return resError(e);
    }
  }
  async updateAdmin(payload: UpdateDTO, _id) {
    try {
      const id = new mongoose.Types.ObjectId(_id);
      const admin = await this.Admin.findOne({ _id: id });

      if (!admin) {
        throw new ErrorHandlerX({
          message: `Admin with this ID is not found`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (payload.password) {
        admin.password = await this.hashData(payload.password);
      }

      admin.email = payload.email || admin.email;
      admin.role = payload.role || admin.role;
      admin.country = payload.country || admin.country;
      admin.name = payload.name || admin.name;
      admin.phone = payload.phone || admin.phone;
      admin.sex = payload.sex || admin.sex;

      admin.save();
      return resSuccess({
        message: 'Account Updated',
        data: null,
      });
    } catch (e) {
      return resError(e);
    }
  }

  async authAdmin(payload: Admin) {
    try {
      if (!payload.verified) {
        throw new ErrorHandlerX({
          message: `Not yet verified`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      return resSuccess({
        message: 'authenticated',
        data: payload,
      });
    } catch (e) {
      return resError(e);
    }
  }
}
