// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { UserRoleEnums } from '../../enums/user.enum';
// import { UserService } from '../../services/user.service';
// import jwt_decode from 'jwt-decode';

// @Injectable()
// export class AdminRoleGuard implements CanActivate {
//   constructor(private userService: UserService) {}

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest().headers[
//       'authorization'
//     ];
//     const accessToken = request.replace('Bearer ', '');
//     var decoded = jwt_decode(accessToken);

//     if (decoded) {
//       const id = decoded['id'];
//       const user = await this.userService.findById(id);
//       //   return decoded["role"] === UserRoles.ADMIN;
//       return user.role === UserRoleEnums.ADMIN;
//     }

//     return false;
//   }
 
// }
