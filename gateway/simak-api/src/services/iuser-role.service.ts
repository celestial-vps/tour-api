import { CreateUserRoleDto, UpdateUserRoleDto } from "../dtos/payload-user-role-dto";
import { UserRoleVm } from "../mappings/user-role.vm";
import { MessageVm } from "../mappings/message.vm";

export interface IUserRoleService {
  create(createUserRoleDto: CreateUserRoleDto, userOid: string): Promise<{ userRole: MessageVm | null, err: any }>;
  update( oid: string,updateUserRoleDto: UpdateUserRoleDto, userOid: string): Promise<{ userRole: UserRoleVm | null; err: any }>;
  deleted(oid: string, userOid: string): Promise<{ userRole: UserRoleVm | null; err: any }>;
  findAll(): Promise<{ userRoles: UserRoleVm[] | null; err: any }>;
  findById(oid: string): Promise<{ userRole: UserRoleVm | null; err: any }>;
  findPage(condition: any, page: number, pageSize: number): Promise<{ userRoles: UserRoleVm[], total: number, err: any }>;
}
