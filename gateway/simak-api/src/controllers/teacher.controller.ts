import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from '../dtos/payload-teacher-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';

@Controller('teacher')
@ApiBearerAuth()
@ApiTags('Teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Teacher' })
  @ApiBody({ type: CreateTeacherDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The teacher has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createTeacherDto: CreateTeacherDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;  // userId sesuai payload di JwtStrategy validate()
      const teacherResponse = await this.teacherService.create(createTeacherDto, userOid);
      const response = this.responseService.responseOk(teacherResponse.teacher, 1);
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
        recordOid: teacherResponse?.teacher ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Teacher success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: teacherResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
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
  @ApiOperation({ summary: 'Update a Teacher' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the teacher to be updated' })  // Document the OID parameter
  @ApiBody({ type: UpdateTeacherDto })  // Document the body DTO used for updating
  @ApiOkResponse({ description: 'The teacher has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateTeacherDto: UpdateTeacherDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
      const teacherResponse = await this.teacherService.update(oid, updateTeacherDto, userOid);
      if (teacherResponse.err) {
        await this.auditTrailService.recordPost({
          tableName: 'teachers',
          recordOid: 'unknown',
          action: 'CREATE',
          status: 'ERROR',
          message: teacherResponse.err,
          userOid: req.user?.oid,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
        throw new BadRequestException(teacherResponse.err);
      }
      const response = this.responseService.responseOk(teacherResponse.teacher, 1);
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
        recordOid: teacherResponse?.teacher ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Teacher success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: teacherResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
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
  @ApiOperation({ summary: 'Delete a Teacher' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the teacher to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The teacher has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const teacherResponse = await this.teacherService.deleted(oid, userOid);;
      const response = this.responseService.responseOk(teacherResponse.teacher, 1);
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
        recordOid: teacherResponse?.teacher ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Teacher success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: teacherResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
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
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiOkResponse({ description: 'List of all teachers', type: [CreateTeacherDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const teachers = await this.teacherService.findAll();

      const response = this.responseService.responseOk(teachers.teachers, teachers.teachers ? teachers.teachers.length : 0);
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Teacher success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
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
  @ApiOperation({ summary: 'Get a specific teacher by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the teacher to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The teacher details', type: CreateTeacherDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const teacher = await this.teacherService.findById(oid);;
      const response = this.responseService.responseOk(teacher.teacher, 1);
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Teacher success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
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
  @ApiOperation({ summary: 'Find teachers with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterTeacherDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered teachers with pagination', type: CreateTeacherDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
    @Body() filterTeacherDto: FilterTeacherDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { teachers, total, err } = await this.teacherService.findPage(pageIndex, pageSize, filterTeacherDto);
      const totalPage = Math.ceil(total / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: total,
        totalPage: totalPage, // Correctly calculates total pages			
      };
      const response = this.responseService.responseOkWithPagination(teachers, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Teacher success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'teachers',
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
