import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { KrsService } from '../services/krs.service';
import { CreateKrsDto, FilterKrsDto, UpdateKrsDto } from '../dtos/payload-krs-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';

@Controller('krs')
@ApiBearerAuth()
@ApiTags('Krs')
export class KrsController {
  constructor(private readonly krsService: KrsService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Krs' })
  @ApiBody({ type: CreateKrsDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The krs has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createKrsDto: CreateKrsDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;  // userId sesuai payload di JwtStrategy validate()
      const krsResponse = await this.krsService.create(createKrsDto, userOid);

      if (krsResponse.err) {
        await this.auditTrailService.recordPost({
          tableName: 'krss',
          recordOid: 'unknown',
          action: 'CREATE',
          status: 'ERROR',
          message: krsResponse.err,
          userOid: req.user?.oid,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
        throw new BadRequestException(krsResponse.err);
      }
      const response = this.responseService.responseOk(krsResponse.krs, 1);
      await this.auditTrailService.recordPost({
        tableName: 'krss',
        recordOid: krsResponse?.krs ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Krs success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: krsResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'krss',
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
  @ApiOperation({ summary: 'Update a Krs' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the krs to be updated' })  // Document the OID parameter
  @ApiBody({ type: UpdateKrsDto })  // Document the body DTO used for updating
  @ApiOkResponse({ description: 'The krs has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateKrsDto: UpdateKrsDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
      const krsResponse = await this.krsService.update(oid, updateKrsDto, userOid);
      const response = this.responseService.responseOk(krsResponse.krs, 1);
      await this.auditTrailService.recordPost({
        tableName: 'krss',
        recordOid: krsResponse?.krs ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Krs success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: krsResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'krss',
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
  @ApiOperation({ summary: 'Delete a Krs' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the krs to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The krs has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const krsResponse = await this.krsService.deleted(oid, userOid);;
      const response = this.responseService.responseOk(krsResponse.krs, 1);
      await this.auditTrailService.recordPost({
        tableName: 'krss',
        recordOid: krsResponse?.krs ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Krs success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: krsResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'krss',
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
  @ApiOperation({ summary: 'Get all krss' })
  @ApiOkResponse({ description: 'List of all krss', type: [CreateKrsDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const krss = await this.krsService.findAll();

      const response = this.responseService.responseOk(krss.krss, krss.krss ? krss.krss.length : 0);
      await this.auditTrailService.recordPost({
        tableName: 'krss',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Krs success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'krss',
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
  @ApiOperation({ summary: 'Get a specific krs by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the krs to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The krs details', type: CreateKrsDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const krs = await this.krsService.findById(oid);;
      const response = this.responseService.responseOk(krs.krs, 1);
      await this.auditTrailService.recordPost({
        tableName: 'krss',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Krs success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'krss',
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
  @ApiOperation({ summary: 'Find krss with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterKrsDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered krss with pagination', type: CreateKrsDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
    @Body() filterKrsDto: FilterKrsDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { krss, total, err } = await this.krsService.findPage(pageIndex, pageSize, filterKrsDto);
      const totalPage = Math.ceil(total / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: total,
        totalPage: totalPage, // Correctly calculates total pages			
      };
      const response = this.responseService.responseOkWithPagination(krss, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'krss',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Krs success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'krss',
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
