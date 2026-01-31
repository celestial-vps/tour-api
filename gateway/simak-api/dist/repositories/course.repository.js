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
exports.CourseRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_1 = require("../models/course");
const mapper_1 = require("../misc/mapper");
const course_domain_1 = require("../domain/course.domain");
let CourseRepository = class CourseRepository {
    courseModel;
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async save(course) {
        try {
            const collectionCourse = new this.courseModel(course);
            collectionCourse.createdAt = (0, mongoose_2.now)();
            const colCourse = await collectionCourse.save();
            const data = mapper_1.Mapper.mapToDomain(course_domain_1.CourseDomain, colCourse);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, course) {
        try {
            const collectionCourse = await this.courseModel.findByIdAndUpdate({ _id: oid }, course, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(course_domain_1.CourseDomain, collectionCourse);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(course, oid) {
        try {
            const data = await this.courseModel.findByIdAndDelete({ _id: oid });
            return { result: course, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const courses = await this.courseModel.find();
            const data = mapper_1.Mapper.mapToDomain(course_domain_1.CourseDomain, courses);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.courseCode) {
                query.courseCode = { $regex: condition.courseCode, $options: 'i' };
            }
            if (condition.courseName) {
                query.courseName = { $regex: condition.courseName, $options: 'i' };
            }
            const courses = await this.courseModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(course_domain_1.CourseDomain, courses);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const course = await this.courseModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(course_domain_1.CourseDomain, course);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.courseCode) {
                query.courseCode = { $regex: condition.courseCode, $options: 'i' };
            }
            if (condition.courseName) {
                query.courseName = { $regex: condition.courseName, $options: 'i' };
            }
            const count = await this.courseModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.courseCode) {
                query.courseCode = { $regex: condition.courseCode, $options: 'i' };
            }
            if (condition.courseName) {
                query.courseName = { $regex: condition.courseName, $options: 'i' };
            }
            const courses = await this.courseModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(course_domain_1.CourseDomain, courses);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.CourseRepository = CourseRepository;
exports.CourseRepository = CourseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CourseRepository);
//# sourceMappingURL=course.repository.js.map