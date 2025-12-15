// src/course/course.service.ts
import { Injectable } from '@nestjs/common';


import { CreateCourseDto, FilterCourseDto, UpdateCourseDto } from '../dtos/payload-course-dto';
import { Course } from '../models/course'; // Assuming you have this entity
import { ICourseService } from '../services/icourse.service';
import { CourseVm, toCourseResponse, toCourseResponses } from '../mappings/course.vm';
import { MessageVm } from '../mappings/message.vm';
import { CourseRepository } from '../repositories/course.repository';
// src/course/course.service.ts 

@Injectable()
export class CourseService implements ICourseService {

    constructor(private readonly courseRepository: CourseRepository,
    ) { }

    async create(createCourseDto: CreateCourseDto, userOid: string): Promise<{ course: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const course = new Course();
            course.courseCode = createCourseDto.courseCode;
            course.courseName = createCourseDto.courseName;
            course.credits = createCourseDto.credits;

            const { result, err } = await this.courseRepository.save(course);
            if (err) {
                return { course: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.courseName : '',
            };
            return { course: messageVm, err: null };
        } catch (err) {
            return { course: null, err };
        }
    }

    async update(oid: string,updateCourseDto: UpdateCourseDto,  userOid: string): Promise<{ course: CourseVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.courseRepository.findById(oid);

            if (errFind != null) {
                return {
                    course: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    course: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const now = new Date();
            if (resultFind == null) {
                return {
                    course: null, err: {}
                }
            }
            resultFind.courseCode = updateCourseDto.courseCode ?? resultFind.courseCode;
            resultFind.courseName = updateCourseDto.courseName ?? resultFind.courseName;
            resultFind.credits = updateCourseDto.credits ?? resultFind.credits;
            // Save updated course details
            const { result, err } = await this.courseRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    course: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const courseVm = result ? toCourseResponse(result) : null;
            return { course: courseVm, err: null };
        }
        catch (err) {
            return { course: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ course: CourseVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.courseRepository.findById(oid);
            if (errFind != null) {
                return {
                    course: null, err: errFind
                }
            }

            if (resultFind == null) {
                return {
                    course: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.courseRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    course: null, err: err
                }
            }

            const courseVm = result ? toCourseResponse(result) : null;
            return { course: courseVm, err: null };
        } catch (err) {
            return { course: null, err };
        }

    }

    async findAll(): Promise<{ courses: CourseVm[] | null; err: any }> {
        try {
            const { result, err } = await this.courseRepository.findAll();

            if (err != null) {
                return {
                    courses: null, err: err
                }
            }
            const courses = result ?  toCourseResponses(result) : null;
            return { courses, err: null }
        } catch (err) {
            return { courses: null, err }
        }
    }

    async findById(oid: string): Promise<{ course: CourseVm | null; err: any }> {
        try {
            const { result, err } = await this.courseRepository.findById(oid);
            const courseVm = result ? toCourseResponse(result) : null;
            return { course: courseVm, err: null }
        } catch (err) {
            return { course: null, err }
        }


    }

    async findPage( page: number, pageSize: number,condition:FilterCourseDto): Promise<{ courses: CourseVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.courseRepository.findCountByCriteria(condition);
            if (errCount) {
                return { courses: [], total: 0, err: errCount }
            }

            const { result, err } = await this.courseRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { courses: [], total: 0, err }
            }
            const courseVm = toCourseResponses(result ?? []);
            return { courses: courseVm, total: resultCount, err: err };
        } catch (err) {
            return { courses: [], total: 0, err }
        }
    }

}
