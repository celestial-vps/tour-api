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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const student_1 = require("../models/student");
const student_vm_1 = require("../mappings/student.vm");
const student_repository_1 = require("../repositories/student.repository");
const register_midleware_service_1 = require("../middleware/register/register-midleware-service");
let StudentService = class StudentService {
    studentRepository;
    registerService;
    constructor(studentRepository, registerService) {
        this.studentRepository = studentRepository;
        this.registerService = registerService;
    }
    async create(createStudentDto, userOid) {
        const now = new Date();
        try {
            const student = new student_1.Student();
            student.nim = createStudentDto.nim;
            student.name = createStudentDto.name;
            student.studyProgram = createStudentDto.studyProgram;
            student.yearOfEntry = createStudentDto.yearOfEntry;
            const { result, err } = await this.studentRepository.save(student);
            if (err) {
                return { student: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.name : '',
            };
            return { student: messageVm, err: null };
        }
        catch (err) {
            return { student: null, err };
        }
    }
    async update(oid, updateStudentDto, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.studentRepository.findById(oid);
            if (errFind != null) {
                return {
                    student: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    student: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    student: null, err: {}
                };
            }
            resultFind.nim = updateStudentDto.nim ?? resultFind.nim;
            resultFind.name = updateStudentDto.name ?? resultFind.name;
            resultFind.studyProgram = updateStudentDto.studyProgram ?? resultFind.studyProgram;
            resultFind.yearOfEntry = updateStudentDto.yearOfEntry ?? resultFind.yearOfEntry;
            const { result, err } = await this.studentRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    student: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const studentVm = result ? (0, student_vm_1.toStudentResponse)(result) : null;
            return { student: studentVm, err: null };
        }
        catch (err) {
            return { student: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.studentRepository.findById(oid);
            if (errFind != null) {
                return {
                    student: null, err: errFind
                };
            }
            if (resultFind == null) {
                return {
                    student: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.studentRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    student: null, err: err
                };
            }
            const studentVm = result ? (0, student_vm_1.toStudentResponse)(result) : null;
            return { student: studentVm, err: null };
        }
        catch (err) {
            return { student: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.studentRepository.findAll();
            if (err != null) {
                return {
                    students: null, err: err
                };
            }
            const students = result ? (0, student_vm_1.toStudentResponses)(result) : null;
            return { students, err: null };
        }
        catch (err) {
            return { students: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.studentRepository.findById(oid);
            const studentVm = result ? (0, student_vm_1.toStudentResponse)(result) : null;
            return { student: studentVm, err: null };
        }
        catch (err) {
            return { student: null, err };
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { result: resultCount, err: errCount } = await this.studentRepository.findCountByCriteria(condition);
            if (errCount) {
                return { students: [], total: 0, err: errCount };
            }
            const { result, err } = await this.studentRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { students: [], total: 0, err };
            }
            const studentVm = (0, student_vm_1.toStudentResponses)(result ?? []);
            return { students: studentVm, total: resultCount, err: err };
        }
        catch (err) {
            return { students: [], total: 0, err };
        }
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [student_repository_1.StudentRepository,
        register_midleware_service_1.RegisterService])
], StudentService);
//# sourceMappingURL=student.service.js.map