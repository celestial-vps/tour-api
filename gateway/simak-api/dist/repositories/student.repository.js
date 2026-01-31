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
exports.StudentRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const student_1 = require("../models/student");
const mapper_1 = require("../misc/mapper");
const student_domain_1 = require("../domain/student.domain");
let StudentRepository = class StudentRepository {
    studentModel;
    constructor(studentModel) {
        this.studentModel = studentModel;
    }
    async save(student) {
        try {
            const collectionStudent = new this.studentModel(student);
            collectionStudent.createdAt = (0, mongoose_2.now)();
            const colStudent = await collectionStudent.save();
            const data = mapper_1.Mapper.mapToDomain(student_domain_1.StudentDomain, colStudent);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, student) {
        try {
            const collectionStudent = await this.studentModel.findByIdAndUpdate({ _id: oid }, student, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(student_domain_1.StudentDomain, collectionStudent);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(student, oid) {
        try {
            const data = await this.studentModel.findByIdAndDelete({ _id: oid });
            return { result: student, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const students = await this.studentModel.find();
            const data = mapper_1.Mapper.mapToDomain(student_domain_1.StudentDomain, students);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.nim) {
                query.nim = { $regex: condition.nim, $options: 'i' };
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' };
            }
            const students = await this.studentModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(student_domain_1.StudentDomain, students);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const student = await this.studentModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(student_domain_1.StudentDomain, student);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.nim) {
                query.nim = { $regex: condition.nim, $options: 'i' };
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' };
            }
            const count = await this.studentModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.nim) {
                query.nim = { $regex: condition.nim, $options: 'i' };
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' };
            }
            const students = await this.studentModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(student_domain_1.StudentDomain, students);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.StudentRepository = StudentRepository;
exports.StudentRepository = StudentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_1.Student.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StudentRepository);
//# sourceMappingURL=student.repository.js.map