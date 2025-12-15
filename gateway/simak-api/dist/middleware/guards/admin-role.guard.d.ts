import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../../services/user.service';
export declare class AdminRoleGuard implements CanActivate {
    private readonly userService;
    constructor(userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
