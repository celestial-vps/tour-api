import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { NewsCategoryService } from '../services/news-category.service';
import { CreateNewsCategoryDto, FilterNewsCategoryDto, UpdateNewsCategoryDto } from '../dtos/payload-news-category-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { SystemRoleGuard } from '../middleware/guards/viewer-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Controller('news-category')
@ApiBearerAuth()
@ApiTags('News Category')
export class NewsCategoryController {
  constructor(private readonly newsCategoryService: NewsCategoryService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new NewsCategory' })
  @ApiBody({ type: CreateNewsCategoryDto }) 
  @ApiOkResponse({ description: 'The newsCategory has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createNewsCategoryDto: CreateNewsCategoryDto, @Request() req: any): Promise<any> {
    try {      
      const userOid = req.user?.oid;   
      const newsCategoryResponse = await this.newsCategoryService.create(createNewsCategoryDto, userOid);
      const response = this.responseService.responseOk(newsCategoryResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
        recordOid: newsCategoryResponse?.value ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create NewsCategory success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: newsCategoryResponse,
      });
      return response;  
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
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

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a NewsCategory' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the newsCategory to be updated' })   
  @ApiBody({ type: UpdateNewsCategoryDto })   
  @ApiOkResponse({ description: 'The newsCategory has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateNewsCategoryDto: UpdateNewsCategoryDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  
      const newsCategoryResponse = await this.newsCategoryService.update(oid, updateNewsCategoryDto, userOid);
      const response = this.responseService.responseOk(newsCategoryResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
        recordOid: newsCategoryResponse?.value ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update NewsCategory success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: newsCategoryResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
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

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @ApiOperation({ summary: 'Delete a NewsCategory' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the newsCategory to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The newsCategory has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const newsCategoryResponse = await this.newsCategoryService.deleted(oid);;
      const response = this.responseService.responseOk(newsCategoryResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
        recordOid: newsCategoryResponse?.value ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update NewsCategory success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: newsCategoryResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
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

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all newsCategories' })
  @ApiOkResponse({ description: 'List of all newsCategories', type: [CreateNewsCategoryDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const newsCategories = await this.newsCategoryService.findAll();

      const response = this.responseService.responseOk(newsCategories, newsCategories.length);
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update NewsCategory success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
     await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
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

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific newsCategory by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the newsCategory to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The newsCategory details', type: CreateNewsCategoryDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const newsCategory = await this.newsCategoryService.findById(oid);;
      const response = this.responseService.responseOk(newsCategory, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update NewsCategory success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
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

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find newsCategories with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterNewsCategoryDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered newsCategories with pagination', type: CreateNewsCategoryDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  
    @Query('pageSize') pageSize: number = 10,    
    @Body() filterNewsCategoryDto: FilterNewsCategoryDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { newsCategories, count } = await this.newsCategoryService.findPage(pageIndex, pageSize, filterNewsCategoryDto);
      const totalPage = Math.ceil(count / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: count,
        totalPage: totalPage,  		
      };
      const response = this.responseService.responseOkWithPagination(newsCategories, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update NewsCategory success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newsCategories',
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
