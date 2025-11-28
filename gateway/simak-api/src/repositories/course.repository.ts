import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Course, CourseDocument } from '../models/course';
import { ICourseRepository } from '../repositories/icourse.repository';
import { FilterCourseDto } from '../dtos/payload-course-dto';
import { Mapper } from '../misc/mapper';
import { CourseDomain } from '../domain/course.domain';

@Injectable()
export class CourseRepository implements ICourseRepository {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    ) { }

    async save(course: Course): Promise<{ result: CourseDomain | null; err: any }> {
        try {
            const collectionCourse = new this.courseModel(course);
            collectionCourse.createdAt = now();
            const colCourse = await collectionCourse.save();
            const data = Mapper.mapToDomain(CourseDomain, colCourse) as CourseDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err };
        }
    }

    async update(oid: string, course: CourseDomain): Promise<{ result: CourseDomain | null; err: any }> {
        try {
            const collectionCourse = await this.courseModel.findByIdAndUpdate(
                { _id: oid },
                course,
                {
                    new: true,
                },
            );
            const data = Mapper.mapToDomain(CourseDomain, collectionCourse) as CourseDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for course and the error
        }
    }

    async deleted(course: CourseDomain, oid: string): Promise<{ result: CourseDomain | null; err: any }> {
        try {
            const data = await this.courseModel.findByIdAndDelete({ _id: oid });
            return { result: course, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for course and the error
        }
    }

    async findAll(): Promise<{ result: CourseDomain[] | null; err: any }> {
        try {
            const courses = await this.courseModel.find(); // Await the find operation
            const data = Mapper.mapToDomain(CourseDomain, courses) as CourseDomain[];
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for courses and the error
        }
    }

    async advanceFlter(condition: FilterCourseDto): Promise<{ result: CourseDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.courseCode) {
                query.courseCode = { $regex: condition.courseCode, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.courseName) {
                query.courseName = { $regex: condition.courseName, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const courses = await this.courseModel.find(query)
            const data = Mapper.mapToDomain(CourseDomain, courses) as CourseDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: null, err: error };
        }
    }

    async findById(oid: string): Promise<{ result: CourseDomain | null; err: any }> {
        try {
            const course = await this.courseModel.findOne({ _id: oid }); // Await the find operation
            const data = Mapper.mapToDomain(CourseDomain, course) as CourseDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for course and the error
        }
    }

    async findCountByCriteria(condition: FilterCourseDto): Promise<{ result: number | 0; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.courseCode) {
                query.courseCode = { $regex: condition.courseCode, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.courseName) {
                query.courseName = { $regex: condition.courseName, $options: 'i' }; // Case-insensitive regex search
            }

            // Count the total number of records matching the condition
            const count = await this.courseModel.countDocuments(query);


            return { result: count, err: null };

        } catch (err) {
            return { result: 0, err };
        }

    }

    async findByCriteriaPage(condition: FilterCourseDto, page: number, pageSize: number): Promise<{ result: CourseDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.courseCode) {
                query.courseCode = { $regex: condition.courseCode, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.courseName) {
                query.courseName = { $regex: condition.courseName, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const courses = await this.courseModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = Mapper.mapToDomain(CourseDomain, courses) as CourseDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: [], err: error };
        }
    }
}
