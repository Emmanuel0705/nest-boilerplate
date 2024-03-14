import {
  Post,
  Req,
  Res,
  Body,
  Controller,
  Version,
  UseGuards,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminGuard } from 'src/guards/admin';
import { RolesGuard } from 'src/guards/role';
import { Roles } from 'src/guards/role.decorator';
import { ROLES, Admin } from 'src/models/admin';
import { EServerVersions } from '../../utils/constant';

import { IAuthToken } from '../auth/auth.dto';
import { AdminService } from './admin.service';
import {
  CDepositDTO,
  CreateSignalDto,
  CWithdrawDto,
  FundWalletDTO,
  IAdminOnboarding,
  LoginDTO,
  UpdateDTO,
} from './index.dto';

@Controller('admin')
export class AdminController {
  adminData: IAuthToken;

  constructor(private readonly adminService: AdminService) {}

  @Version(`${EServerVersions.V1}`)
  @Post('')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async newAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IAdminOnboarding,
  ) {
    const result = await this.adminService.createAdmin(body);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/login')
  async loginAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginDTO,
  ) {
    const result = await this.adminService.login(body);
    res.status(result.statusCode).send(result);
  }
  @Version(`${EServerVersions.V1}`)
  @Get('/')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async allAdmin(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.allAdmin();
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/super-admin')
  async createSPAdmin(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.createSPAdmin();
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/users')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.allUser();
    res.status(result.statusCode).send(result);
  }
  @Version(`${EServerVersions.V1}`)
  @Get('/auth')
  @UseGuards(AdminGuard)
  async authAdmin(
    @Req() req: Request & { admin: Admin },
    @Res() res: Response,
  ) {
    const result = await this.adminService.authAdmin(req.admin);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/signal')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async createSignal(@Res() res: Response, @Body() body: CreateSignalDto) {
    const result = await this.adminService.createSignal(body);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/signals')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getsignal(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getSignals(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/deposits')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getDeposits(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getDeposit(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/all-plans')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getPlans(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getPlans(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/all-investments')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getInvestments(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getInvestments(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/all-trades')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getTrades(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getTrades(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/all-bonuses')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getBonus(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getBonus(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/approve-deposit/:id')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async confirmDeposits(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CDepositDTO,
  ) {
    const result = await this.adminService.approveDeposit(req.params?.id, body);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/approve-withdraw/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async confirmWitdraw(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CWithdrawDto,
  ) {
    const result = await this.adminService.approveWithdraw(
      req.params?.id,
      body,
    );
    res.status(result.statusCode).send(result);
  }
  @Version(`${EServerVersions.V1}`)
  @Delete('/signal/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async deleteSignal(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.deleteSignal(req.params?.id);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/fund')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async fund(@Body() body: FundWalletDTO, @Res() res: Response) {
    const result = await this.adminService.fund(body);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/decline-withdraw/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async declineWithdraws(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.declineWithdraw(req.params?.id);
    res.status(result.statusCode).send(result);
  }
  @Version(`${EServerVersions.V1}`)
  @Post('/decline-deposit/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async declineDeposits(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.declineDeposit(req.params?.id);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/withdraws')
  // @UseGuards(AdminGuard, RolesGuard)
  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  async getWithdraws(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getWitdraw(req.query);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Put('/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async updateRole(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UpdateDTO,
  ) {
    const result = await this.adminService.updateAdmin(body, req.params.id);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Delete('/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async deleteAdmin(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.deleteAdmin(req.params.id);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Post('/verify/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async verifyAdmin(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.verifyAdmin(req.params.id);
    res.status(result.statusCode).send(result);
  }

  @Version(`${EServerVersions.V1}`)
  @Get('/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async getAdmin(@Req() req: Request, @Res() res: Response) {
    const result = await this.adminService.getAdmin(req.params.id);
    res.status(result.statusCode).send(result);
  }
}
