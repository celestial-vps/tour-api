import { CreateStudentDto, FilterStudentDto, UpdateStudentDto } from "../dtos/payload-student-dto";
import { StudentVm } from "../mappings/student.vm";
import { MessageVm } from "../mappings/message.vm";

export interface IStudentService {
  create(createStudentDto: CreateStudentDto, userOid: string): Promise<{ student: MessageVm | null, err: any }>;
  update(oid: string,updateStudentDto: UpdateStudentDto,  userOid: string): Promise<{ student: StudentVm | null; err: any }>;
  deleted(oid: string, userOid: string): Promise<{ student: StudentVm | null; err: any }>;
  findAll(): Promise<{ students: StudentVm[] | null; err: any }>;
  findById(oid: string): Promise<{ student: StudentVm | null; err: any }>;
  findPage( page: number, pageSize: number,condition: FilterStudentDto): Promise<{ students: StudentVm[], total: number, err: any  }>;  
}
