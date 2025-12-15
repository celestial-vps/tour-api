// src/teacher/teacher.service.ts
import { Injectable } from '@nestjs/common';


import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from '../dtos/payload-teacher-dto';
import { Teacher } from '../models/teacher'; // Assuming you have this entity
import { ITeacherService } from '../services/iteacher.service';
import { TeacherVm, toTeacherResponse, toTeacherResponses } from '../mappings/teacher.vm';
import { MessageVm } from '../mappings/message.vm';
import { TeacherRepository } from '../repositories/teacher.repository';
// src/teacher/teacher.service.ts 

@Injectable()
export class TeacherService implements ITeacherService {

    constructor(private readonly teacherRepository: TeacherRepository,
    ) { }

    async create(createTeacherDto: CreateTeacherDto, userOid: string): Promise<{ teacher: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const teacher = new Teacher();
            teacher.nidn = createTeacherDto.nidn;
            teacher.name = createTeacherDto.name;

            const { result, err } = await this.teacherRepository.save(teacher);
            if (err) {
                return { teacher: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.name : '',
            };
            return { teacher: messageVm, err: null };
        } catch (err) {
            return { teacher: null, err };
        }
    }

    async update(oid: string,updateTeacherDto: UpdateTeacherDto,  userOid: string): Promise<{ teacher: TeacherVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.teacherRepository.findById(oid);

            if (errFind != null) {
                return {
                    teacher: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    teacher: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const now = new Date();
            if (resultFind == null) {
                return {
                    teacher: null, err: {}
                }
            }
            resultFind.nidn = updateTeacherDto.nidn ?? resultFind.nidn;
            resultFind.name = updateTeacherDto.name ?? resultFind.name;
             // Save updated teacher details
            const { result, err } = await this.teacherRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    teacher: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const teacherVm = result ? toTeacherResponse(result) : null;
            return { teacher: teacherVm, err: null };
        }
        catch (err) {
            return { teacher: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ teacher: TeacherVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.teacherRepository.findById(oid);
            if (errFind != null) {
                return {
                    teacher: null, err: errFind
                }
            }

            if (resultFind == null) {
                return {
                    teacher: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.teacherRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    teacher: null, err: err
                }
            }

            const teacherVm = result ? toTeacherResponse(result) : null;
            return { teacher: teacherVm, err: null };
        } catch (err) {
            return { teacher: null, err };
        }

    }

    async findAll(): Promise<{ teachers: TeacherVm[] | null; err: any }> {
        try {
            const { result, err } = await this.teacherRepository.findAll();

            if (err != null) {
                return {
                    teachers: null, err: err
                }
            }
            const teachers = result ?  toTeacherResponses(result) : null;
            return { teachers, err: null }
        } catch (err) {
            return { teachers: null, err }
        }
    }

    async findById(oid: string): Promise<{ teacher: TeacherVm | null; err: any }> {
        try {
            const { result, err } = await this.teacherRepository.findById(oid);
            const teacherVm = result ? toTeacherResponse(result) : null;
            return { teacher: teacherVm, err: null }
        } catch (err) {
            return { teacher: null, err }
        }


    }

    async findPage( page: number, pageSize: number,condition:FilterTeacherDto): Promise<{ teachers: TeacherVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.teacherRepository.findCountByCriteria(condition);
            if (errCount) {
                return { teachers: [], total: 0, err: errCount }
            }

            const { result, err } = await this.teacherRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { teachers: [], total: 0, err }
            }
            const teacherVm = toTeacherResponses(result ?? []);
            return { teachers: teacherVm, total: resultCount, err: err };
        } catch (err) {
            return { teachers: [], total: 0, err }
        }
    }

}
