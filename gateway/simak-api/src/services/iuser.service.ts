import { CreateUserDto, UpdateUserDto } from "../dtos/payload-user-dto";
import { UserVm } from "../mappings/user.vm";
import { MessageVm } from "../mappings/message.vm";

export interface IUserService {
  create(createUserDto: CreateUserDto, userOid: string): Promise<{ user: MessageVm | null , err: any }>;
  update(updateUserDto: UpdateUserDto, oid: string, userOid: string): Promise<{ user: UserVm | null; err: any }>;
  deleted(oid: string, userOid: string): Promise<{ user: UserVm | null; err: any }>;
  findAll(): Promise<{ users: UserVm[] | null; err: any }>;
  findById(oid: string): Promise<{ user: UserVm | null; err: any }>;
  findPage(condition: any, page: number, pageSize: number): Promise<{ users: UserVm[], total: number, err: any  }>;  
}
