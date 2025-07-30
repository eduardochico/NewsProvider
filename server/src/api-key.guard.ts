import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const expected = process.env.API_KEY;
    if (!expected) {
      throw new UnauthorizedException('API_KEY not configured');
    }
    const provided = req.headers['x-api-key'];
    if (!provided || provided !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
