import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from "../dtos/payload-teacher-dto";
import { TeacherVm } from "../mappings/teacher.vm";
import { MessageVm } from "../mappings/message.vm";
export interface ITeacherService {
    create(createTeacherDto: CreateTeacherDto, userOid: string): Promise<{
        teacher: MessageVm | null;
        err: any;
    }>;
    update(oid: string, updateTeacherDto: UpdateTeacherDto, userOid: string): Promise<{
        teacher: TeacherVm | null;
        err: any;
    }>;
    deleted(oid: string, userOid: string): Promise<{
        teacher: TeacherVm | null;
        err: any;
    }>;
    findAll(): Promise<{
        teachers: TeacherVm[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        teacher: TeacherVm | null;
        err: any;
    }>;
    findPage(page: number, pageSize: number, condition: FilterTeacherDto): Promise<{
        teachers: TeacherVm[];
        total: number;
        err: any;
    }>;
}
