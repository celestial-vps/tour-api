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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const teacher_1 = require("../models/teacher");
const teacher_vm_1 = require("../mappings/teacher.vm");
const teacher_repository_1 = require("../repositories/teacher.repository");
let TeacherService = class TeacherService {
    teacherRepository;
    constructor(teacherRepository) {
        this.teacherRepository = teacherRepository;
    }
    async create(createTeacherDto, userOid) {
        const now = new Date();
        try {
            const teacher = new teacher_1.Teacher();
            teacher.nidn = createTeacherDto.nidn;
            teacher.name = createTeacherDto.name;
            const { result, err } = await this.teacherRepository.save(teacher);
            if (err) {
                return { teacher: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.name : '',
            };
            return { teacher: messageVm, err: null };
        }
        catch (err) {
            return { teacher: null, err };
        }
    }
    async update(oid, updateTeacherDto, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.teacherRepository.findById(oid);
            if (errFind != null) {
                return {
                    teacher: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    teacher: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    teacher: null, err: {}
                };
            }
            resultFind.nidn = updateTeacherDto.nidn ?? resultFind.nidn;
            resultFind.name = updateTeacherDto.name ?? resultFind.name;
            const { result, err } = await this.teacherRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    teacher: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const teacherVm = result ? (0, teacher_vm_1.toTeacherResponse)(result) : null;
            return { teacher: teacherVm, err: null };
        }
        catch (err) {
            return { teacher: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.teacherRepository.findById(oid);
            if (errFind != null) {
                return {
                    teacher: null, err: errFind
                };
            }
            if (resultFind == null) {
                return {
                    teacher: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.teacherRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    teacher: null, err: err
                };
            }
            const teacherVm = result ? (0, teacher_vm_1.toTeacherResponse)(result) : null;
            return { teacher: teacherVm, err: null };
        }
        catch (err) {
            return { teacher: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.teacherRepository.findAll();
            if (err != null) {
                return {
                    teachers: null, err: err
                };
            }
            const teachers = result ? (0, teacher_vm_1.toTeacherResponses)(result) : null;
            return { teachers, err: null };
        }
        catch (err) {
            return { teachers: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.teacherRepository.findById(oid);
            const teacherVm = result ? (0, teacher_vm_1.toTeacherResponse)(result) : null;
            return { teacher: teacherVm, err: null };
        }
        catch (err) {
            return { teacher: null, err };
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { result: resultCount, err: errCount } = await this.teacherRepository.findCountByCriteria(condition);
            if (errCount) {
                return { teachers: [], total: 0, err: errCount };
            }
            const { result, err } = await this.teacherRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { teachers: [], total: 0, err };
            }
            const teacherVm = (0, teacher_vm_1.toTeacherResponses)(result ?? []);
            return { teachers: teacherVm, total: resultCount, err: err };
        }
        catch (err) {
            return { teachers: [], total: 0, err };
        }
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [teacher_repository_1.TeacherRepository])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map