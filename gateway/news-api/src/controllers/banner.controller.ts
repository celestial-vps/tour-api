import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos/payload-banner-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Controller('banner')
@ApiBearerAuth()
@ApiTags('Banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Banner' })
  @ApiBody({ type: CreateBannerDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The banner has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createBannerDto: CreateBannerDto, @Request() req: any): Promise<any> {
    try {      
      const userOid = req.user?.oid;   
      const bannerResponse = await this.bannerService.create(createBannerDto, userOid);
      const response = this.responseService.responseOk(bannerResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banners',
        recordOid: bannerResponse?.value ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Banner success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: bannerResponse,
      });
      return response;  
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banners',
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
  @ApiOperation({ summary: 'Update a Banner' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the banner to be updated' })   
  @ApiBody({ type: UpdateBannerDto })   
  @ApiOkResponse({ description: 'The banner has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateBannerDto: UpdateBannerDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;   
      const bannerResponse = await this.bannerService.update(oid, updateBannerDto, userOid);
      const response = this.responseService.responseOk(bannerResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banners',
        recordOid: bannerResponse?.value ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Banner success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: bannerResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banners',
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
  @ApiOperation({ summary: 'Delete a Banner' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the banner to be deleted' })   
  @ApiOkResponse({ description: 'The banner has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const bannerResponse = await this.bannerService.deleted(oid,userOid);;
      const response = this.responseService.responseOk(bannerResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banners',
        recordOid: bannerResponse?.value ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Banner success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: bannerResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banners',
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
  @ApiOperation({ summary: 'Get all banners' })
  @ApiOkResponse({ description: 'List of all banners', type: [CreateBannerDto] })   
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const banners = await this.bannerService.findAll();

      const response = this.responseService.responseOk(banners, banners.length);
      await this.auditTrailService.recordPost({
        tableName: 'banners',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Banner success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
     await this.auditTrailService.recordPost({
        tableName: 'banners',
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
  @ApiOperation({ summary: 'Get a specific banner by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the banner to retrieve' })  
  @ApiOkResponse({ description: 'The banner details', type: CreateBannerDto })   
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const banner = await this.bannerService.findById(oid);;
      const response = this.responseService.responseOk(banner, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banners',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Banner success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banners',
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
  @ApiOperation({ summary: 'Find banners with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })   
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })   
  @ApiBody({ type: FilterBannerDto })   
  @ApiOkResponse({ description: 'List of filtered banners with pagination', type: CreateBannerDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,    
    @Body() filterBannerDto: FilterBannerDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { banners, count } = await this.bannerService.findPage(pageIndex, pageSize, filterBannerDto);
      const totalPage = Math.ceil(count / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: count,
        totalPage: totalPage,  			
      };
      const response = this.responseService.responseOkWithPagination(banners, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'banners',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Banner success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banners',
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
