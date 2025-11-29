import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../services/user.service';

@Injectable()
export class SystemRoleGuard implements CanActivate {
  constructor(private readonly userService: UserService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userFromJwt = request.user;

    if (!userFromJwt) {
      throw new UnauthorizedException('Unauthorized');
    }

    // // Ambil user dari DB berdasarkan userId dari JWT
    // const user = await this.userService.findById(userFromJwt.userId);

    // if (user.err!==null || !user.user) {
    //   throw new UnauthorizedException('User not found');
    // }

    // if (user.user?.userRole.roleName !== 'Viewer') {
    //   throw new UnauthorizedException('System role required');
    // }

    // // attach user lengkap ke request
    // request.user = user;

    if (userFromJwt.role !== 'Viewer') {
      throw new UnauthorizedException('System role required');
    }
    request.user = {
      oid: userFromJwt.userId,
      ...userFromJwt,
    };
    return true;
  }
}
