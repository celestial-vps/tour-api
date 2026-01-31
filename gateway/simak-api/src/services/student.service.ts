// src/student/student.service.ts
import { Injectable } from '@nestjs/common';


import { CreateStudentDto, FilterStudentDto, UpdateStudentDto } from '../dtos/payload-student-dto';
import { Student } from '../models/student'; // Assuming you have this entity
import { IStudentService } from '../services/istudent.service';
import { StudentVm, toStudentResponse, toStudentResponses } from '../mappings/student.vm';
import { MessageVm } from '../mappings/message.vm';
import { StudentRepository } from '../repositories/student.repository';
import { RegisterService } from '../middleware/register/register-midleware-service';
// src/student/student.service.ts 

@Injectable()
export class StudentService implements IStudentService {

    constructor(private readonly studentRepository: StudentRepository,
        // private readonly registerService: RegisterService,
    ) { }

    async create(createStudentDto: CreateStudentDto, userOid: string): Promise<{ student: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const student = new Student();
            student.nim = createStudentDto.nim;
            student.name = createStudentDto.name;
            student.studyProgram = createStudentDto.studyProgram;
            student.yearOfEntry = createStudentDto.yearOfEntry;
            const { result, err } = await this.studentRepository.save(student);
            if (err) {
                return { student: null, err };
            }
            // await this.registerService.recordPost({
            //     email: 'students',
            //     password: studentResponse?.student ?? 'unknown',
            //     androidToken: 'CREATE',
            //     roleOid: 'SUCCESS',
            // });
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.name : '',
            };
            return { student: messageVm, err: null };
        } catch (err) {
            return { student: null, err };
        }
    }

    async update(oid: string, updateStudentDto: UpdateStudentDto, userOid: string): Promise<{ student: StudentVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.studentRepository.findById(oid);

            if (errFind != null) {
                return {
                    student: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    student: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const now = new Date();
            if (resultFind == null) {
                return {
                    student: null, err: {}
                }
            }
            resultFind.nim = updateStudentDto.nim ?? resultFind.nim;
            resultFind.name = updateStudentDto.name ?? resultFind.name;
            resultFind.studyProgram = updateStudentDto.studyProgram ?? resultFind.studyProgram;
            resultFind.yearOfEntry = updateStudentDto.yearOfEntry ?? resultFind.yearOfEntry;
            // Save updated student details
            const { result, err } = await this.studentRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    student: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const studentVm = result ? toStudentResponse(result) : null;
            return { student: studentVm, err: null };
        }
        catch (err) {
            return { student: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ student: StudentVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.studentRepository.findById(oid);
            if (errFind != null) {
                return {
                    student: null, err: errFind
                }
            }

            if (resultFind == null) {
                return {
                    student: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.studentRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    student: null, err: err
                }
            }

            const studentVm = result ? toStudentResponse(result) : null;
            return { student: studentVm, err: null };
        } catch (err) {
            return { student: null, err };
        }

    }

    async findAll(): Promise<{ students: StudentVm[] | null; err: any }> {
        try {
            const { result, err } = await this.studentRepository.findAll();

            if (err != null) {
                return {
                    students: null, err: err
                }
            }
            const students = result ? toStudentResponses(result) : null;
            return { students, err: null }
        } catch (err) {
            return { students: null, err }
        }
    }

    async findById(oid: string): Promise<{ student: StudentVm | null; err: any }> {
        try {
            const { result, err } = await this.studentRepository.findById(oid);
            const studentVm = result ? toStudentResponse(result) : null;
            return { student: studentVm, err: null }
        } catch (err) {
            return { student: null, err }
        }


    }

    async findPage(page: number, pageSize: number, condition: FilterStudentDto): Promise<{ students: StudentVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.studentRepository.findCountByCriteria(condition);
            if (errCount) {
                return { students: [], total: 0, err: errCount }
            }

            const { result, err } = await this.studentRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { students: [], total: 0, err }
            }
            const studentVm = toStudentResponses(result ?? []);
            return { students: studentVm, total: resultCount, err: err };
        } catch (err) {
            return { students: [], total: 0, err }
        }
    }

}
