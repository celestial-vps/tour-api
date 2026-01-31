import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, FilterStudentDto, UpdateStudentDto } from '../dtos/payload-student-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';

@Controller('student')
@ApiBearerAuth()
@ApiTags('Student')
export class StudentController {
  constructor(private readonly studentService: StudentService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Student' })
  @ApiBody({ type: CreateStudentDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The student has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createStudentDto: CreateStudentDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;  // userId sesuai payload di JwtStrategy validate()
      const studentResponse = await this.studentService.create(createStudentDto, userOid);
      if (studentResponse.err) {
        await this.auditTrailService.recordPost({
          tableName: 'students',
          recordOid: 'unknown',
          action: 'CREATE',
          status: 'ERROR',
          message: studentResponse.err,
          userOid: req.user?.oid,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
        throw new BadRequestException(studentResponse.err);
      }
      const response = this.responseService.responseOk(studentResponse.student, 1);
      await this.auditTrailService.recordPost({
        tableName: 'students',
        recordOid: studentResponse?.student ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Student success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: studentResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'students',
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
  @ApiOperation({ summary: 'Update a Student' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the student to be updated' })  // Document the OID parameter
  @ApiBody({ type: UpdateStudentDto })  // Document the body DTO used for updating
  @ApiOkResponse({ description: 'The student has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateStudentDto: UpdateStudentDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
      const studentResponse = await this.studentService.update(oid, updateStudentDto, userOid);
      const response = this.responseService.responseOk(studentResponse.student, 1);
      await this.auditTrailService.recordPost({
        tableName: 'students',
        recordOid: studentResponse?.student ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Student success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: studentResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'students',
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
  @ApiOperation({ summary: 'Delete a Student' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the student to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The student has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const studentResponse = await this.studentService.deleted(oid, userOid);;
      const response = this.responseService.responseOk(studentResponse.student, 1);
      await this.auditTrailService.recordPost({
        tableName: 'students',
        recordOid: studentResponse?.student ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Student success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: studentResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'students',
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
  @ApiOperation({ summary: 'Get all students' })
  @ApiOkResponse({ description: 'List of all students', type: [CreateStudentDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const students = await this.studentService.findAll();

      const response = this.responseService.responseOk(students.students, students.students ? students.students.length : 0);
      await this.auditTrailService.recordPost({
        tableName: 'students',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Student success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'students',
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
  @ApiOperation({ summary: 'Get a specific student by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the student to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The student details', type: CreateStudentDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const student = await this.studentService.findById(oid);;
      const response = this.responseService.responseOk(student.student, 1);
      await this.auditTrailService.recordPost({
        tableName: 'students',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Student success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'students',
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
  @ApiOperation({ summary: 'Find students with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterStudentDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered students with pagination', type: CreateStudentDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
    @Body() filterStudentDto: FilterStudentDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { students, total, err } = await this.studentService.findPage(pageIndex, pageSize, filterStudentDto);
      const totalPage = Math.ceil(total / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: total,
        totalPage: totalPage, // Correctly calculates total pages			
      };
      const response = this.responseService.responseOkWithPagination(students, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'students',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Student success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'students',
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
