import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../models/admin';

export const Roles = (...roles: ROLES[]) => SetMetadata('roles', roles);
