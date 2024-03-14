import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LowerCaseEmailGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.body && request.body.email) {
      request.body.email = request.body.email.toLowerCase();
    }
    return true;
  }
}
