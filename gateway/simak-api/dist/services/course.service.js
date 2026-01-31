"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const course_1 = require("../models/course");
const course_vm_1 = require("../mappings/course.vm");
const course_repository_1 = require("../repositories/course.repository");
let CourseService = class CourseService {
    courseRepository;
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }
    async create(createCourseDto, userOid) {
        const now = new Date();
        try {
            const course = new course_1.Course();
            course.courseCode = createCourseDto.courseCode;
            course.courseName = createCourseDto.courseName;
            course.credits = createCourseDto.credits;
            const { result, err } = await this.courseRepository.save(course);
            if (err) {
                return { course: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.courseName : '',
            };
            return { course: messageVm, err: null };
        }
        catch (err) {
            return { course: null, err };
        }
    }
    async update(oid, updateCourseDto, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.courseRepository.findById(oid);
            if (errFind != null) {
                return {
                    course: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    course: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    course: null, err: {}
                };
            }
            resultFind.courseCode = updateCourseDto.courseCode ?? resultFind.courseCode;
            resultFind.courseName = updateCourseDto.courseName ?? resultFind.courseName;
            resultFind.credits = updateCourseDto.credits ?? resultFind.credits;
            const { result, err } = await this.courseRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    course: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const courseVm = result ? (0, course_vm_1.toCourseResponse)(result) : null;
            return { course: courseVm, err: null };
        }
        catch (err) {
            return { course: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.courseRepository.findById(oid);
            if (errFind != null) {
                return {
                    course: null, err: errFind
                };
            }
            if (resultFind == null) {
                return {
                    course: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.courseRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    course: null, err: err
                };
            }
            const courseVm = result ? (0, course_vm_1.toCourseResponse)(result) : null;
            return { course: courseVm, err: null };
        }
        catch (err) {
            return { course: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.courseRepository.findAll();
            if (err != null) {
                return {
                    courses: null, err: err
                };
            }
            const courses = result ? (0, course_vm_1.toCourseResponses)(result) : null;
            return { courses, err: null };
        }
        catch (err) {
            return { courses: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.courseRepository.findById(oid);
            const courseVm = result ? (0, course_vm_1.toCourseResponse)(result) : null;
            return { course: courseVm, err: null };
        }
        catch (err) {
            return { course: null, err };
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { result: resultCount, err: errCount } = await this.courseRepository.findCountByCriteria(condition);
            if (errCount) {
                return { courses: [], total: 0, err: errCount };
            }
            const { result, err } = await this.courseRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { courses: [], total: 0, err };
            }
            const courseVm = (0, course_vm_1.toCourseResponses)(result ?? []);
            return { courses: courseVm, total: resultCount, err: err };
        }
        catch (err) {
            return { courses: [], total: 0, err };
        }
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [course_repository_1.CourseRepository])
], CourseService);
//# sourceMappingURL=course.service.js.map