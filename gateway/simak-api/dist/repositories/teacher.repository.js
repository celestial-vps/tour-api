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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const teacher_1 = require("../models/teacher");
const mapper_1 = require("../misc/mapper");
const teacher_domain_1 = require("../domain/teacher.domain");
let TeacherRepository = class TeacherRepository {
    teacherModel;
    constructor(teacherModel) {
        this.teacherModel = teacherModel;
    }
    async save(teacher) {
        try {
            const collectionTeacher = new this.teacherModel(teacher);
            collectionTeacher.createdAt = (0, mongoose_2.now)();
            const colTeacher = await collectionTeacher.save();
            const data = mapper_1.Mapper.mapToDomain(teacher_domain_1.TeacherDomain, colTeacher);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, teacher) {
        try {
            const collectionTeacher = await this.teacherModel.findByIdAndUpdate({ _id: oid }, teacher, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(teacher_domain_1.TeacherDomain, collectionTeacher);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(teacher, oid) {
        try {
            const data = await this.teacherModel.findByIdAndDelete({ _id: oid });
            return { result: teacher, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const teachers = await this.teacherModel.find();
            const data = mapper_1.Mapper.mapToDomain(teacher_domain_1.TeacherDomain, teachers);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.nidn) {
                query.nidn = { $regex: condition.nidn, $options: 'i' };
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' };
            }
            const teachers = await this.teacherModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(teacher_domain_1.TeacherDomain, teachers);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const teacher = await this.teacherModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(teacher_domain_1.TeacherDomain, teacher);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.nidn) {
                query.nidn = { $regex: condition.nidn, $options: 'i' };
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' };
            }
            const count = await this.teacherModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.nidn) {
                query.nidn = { $regex: condition.nidn, $options: 'i' };
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' };
            }
            const teachers = await this.teacherModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(teacher_domain_1.TeacherDomain, teachers);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.TeacherRepository = TeacherRepository;
exports.TeacherRepository = TeacherRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(teacher_1.Teacher.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TeacherRepository);
//# sourceMappingURL=teacher.repository.js.map