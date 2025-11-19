import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private userService: UserService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const accessToken = authorizationHeader.replace('Bearer ', '');
 
    var decoded = (jwt_decode as any)(accessToken);

    if (decoded) {
      const id = decoded['userOid'];
      const user = await this.userService.findById(id);
      //   return decoded["role"] === UserRoles.ADMIN;
      request.userOid = id;  // Attach userOid here
      request.user = user; 
      return user.role === 'Admin';
    }

    return false;
  }

}
