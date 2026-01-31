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
exports.KrsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const krs_1 = require("../models/krs");
const mapper_1 = require("../misc/mapper");
const krs_domain_1 = require("../domain/krs.domain");
let KrsRepository = class KrsRepository {
    krsModel;
    constructor(krsModel) {
        this.krsModel = krsModel;
    }
    async save(krs) {
        try {
            const collectionKrs = new this.krsModel(krs);
            collectionKrs.createdAt = (0, mongoose_2.now)();
            const colKrs = await collectionKrs.save();
            const data = mapper_1.Mapper.mapToDomain(krs_domain_1.KrsDomain, colKrs);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, krs) {
        try {
            const collectionKrs = await this.krsModel.findByIdAndUpdate({ _id: oid }, krs, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(krs_domain_1.KrsDomain, collectionKrs);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(krs, oid) {
        try {
            const data = await this.krsModel.findByIdAndDelete({ _id: oid });
            return { result: krs, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const krss = await this.krsModel.find();
            const data = mapper_1.Mapper.mapToDomain(krs_domain_1.KrsDomain, krss);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.student) {
                query.student = { $regex: condition.student, $options: 'i' };
            }
            if (condition.semester) {
                query.semester = { $regex: condition.semester, $options: 'i' };
            }
            const krss = await this.krsModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(krs_domain_1.KrsDomain, krss);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const krs = await this.krsModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(krs_domain_1.KrsDomain, krs);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.student) {
                query.student = { $regex: condition.student, $options: 'i' };
            }
            if (condition.semester) {
                query.semester = { $regex: condition.semester, $options: 'i' };
            }
            const count = await this.krsModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.student) {
                query.student = { $regex: condition.student, $options: 'i' };
            }
            if (condition.semester) {
                query.semester = { $regex: condition.semester, $options: 'i' };
            }
            const krss = await this.krsModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(krs_domain_1.KrsDomain, krss);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.KrsRepository = KrsRepository;
exports.KrsRepository = KrsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(krs_1.Krs.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], KrsRepository);
//# sourceMappingURL=krs.repository.js.map