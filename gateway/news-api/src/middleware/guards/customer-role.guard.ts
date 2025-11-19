import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import * as jwt_decode from 'jwt-decode';


@Injectable()
export class CustomerRoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest().headers[
      'authorization'
    ];
    const accessToken = request.replace('Bearer ', '');
    const decoded = (jwt_decode as any).default ? (jwt_decode as any).default(accessToken) : (jwt_decode as any)(accessToken);

    if (decoded) {
      const id = decoded['id'];
      const user = await this.userService.findById(id);      
      return user.role === 'Client';
    }

    return false;
  }
 
}
