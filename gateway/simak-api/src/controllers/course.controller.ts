import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { CreateCourseDto, FilterCourseDto, UpdateCourseDto } from '../dtos/payload-course-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard'; 
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';

@Controller('course')
@ApiBearerAuth()
@ApiTags('Course')
export class CourseController {
  constructor(private readonly courseService: CourseService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Course' })
  @ApiBody({ type: CreateCourseDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The course has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;  // userId sesuai payload di JwtStrategy validate()
      const courseResponse = await this.courseService.create(createCourseDto, userOid);
      const response = this.responseService.responseOk(courseResponse.course, 1);
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: courseResponse?.course ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Course success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: courseResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'CREATE',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a Course' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the course to be updated' })  // Document the OID parameter
  @ApiBody({ type: UpdateCourseDto })  // Document the body DTO used for updating
  @ApiOkResponse({ description: 'The course has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
      const courseResponse = await this.courseService.update(oid, updateCourseDto, userOid);
      const response = this.responseService.responseOk(courseResponse.course, 1);
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: courseResponse?.course ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Course success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: courseResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'UPDATE',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiOperation({ summary: 'Delete a Course' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the course to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The course has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const courseResponse = await this.courseService.deleted(oid, userOid);;
      const response = this.responseService.responseOk(courseResponse.course, 1);
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: courseResponse?.course ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Course success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: courseResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'DELETE',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiOkResponse({ description: 'List of all courses', type: [CreateCourseDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const courses = await this.courseService.findAll();

      const response = this.responseService.responseOk(courses.courses, courses.courses ? courses.courses.length : 0);
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Course success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'READ',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException(error.message);
    }

  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific course by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the course to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The course details', type: CreateCourseDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const course = await this.courseService.findById(oid);;
      const response = this.responseService.responseOk(course.course, 1);
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Course success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'READ',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find courses with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterCourseDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered courses with pagination', type: CreateCourseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
    @Body() filterCourseDto: FilterCourseDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { courses, total, err } = await this.courseService.findPage(pageIndex, pageSize, filterCourseDto);
      const totalPage = Math.ceil(total / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: total,
        totalPage: totalPage, // Correctly calculates total pages			
      };
      const response = this.responseService.responseOkWithPagination(courses, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Course success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'courses',
        recordOid: 'unknown',
        action: 'READ',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException(error.message);
    }
  }

}
