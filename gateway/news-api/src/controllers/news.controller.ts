import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { CreateNewsDto, FilterNewsDto, UpdateNewsDto } from '../dtos/payload-news-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { SystemRoleGuard } from '../middleware/guards/viewer-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Controller('news')
@ApiBearerAuth()
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsService: NewsService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new News' })
  @ApiBody({ type: CreateNewsDto }) 
  @ApiOkResponse({ description: 'The news has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createNewsDto: CreateNewsDto, @Request() req: any): Promise<any> {
    try {      
      const userOid = req.user?.oid;   
      const newsResponse = await this.newsService.create(createNewsDto, userOid);
      const response = this.responseService.responseOk(newsResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newss',
        recordOid: newsResponse?.value ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create News success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: newsResponse,
      });
      return response;  
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newss',
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
  @ApiOperation({ summary: 'Update a News' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the news to be updated' })   
  @ApiBody({ type: UpdateNewsDto })   
  @ApiOkResponse({ description: 'The news has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateNewsDto: UpdateNewsDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  
      const newsResponse = await this.newsService.update(oid, updateNewsDto, userOid);
      const response = this.responseService.responseOk(newsResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newss',
        recordOid: newsResponse?.value ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update News success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: newsResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newss',
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
  @ApiOperation({ summary: 'Delete a News' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the news to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The news has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const newsResponse = await this.newsService.deleted(oid,userOid);;
      const response = this.responseService.responseOk(newsResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newss',
        recordOid: newsResponse?.value ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update News success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: newsResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newss',
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
  @ApiOperation({ summary: 'Get all newss' })
  @ApiOkResponse({ description: 'List of all newss', type: [CreateNewsDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const newss = await this.newsService.findAll();

      const response = this.responseService.responseOk(newss, newss.length);
      await this.auditTrailService.recordPost({
        tableName: 'newss',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update News success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
     await this.auditTrailService.recordPost({
        tableName: 'newss',
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
  @ApiOperation({ summary: 'Get a specific news by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the news to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The news details', type: CreateNewsDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const news = await this.newsService.findById(oid);;
      const response = this.responseService.responseOk(news, 1);
      await this.auditTrailService.recordPost({
        tableName: 'newss',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update News success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newss',
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
  @ApiOperation({ summary: 'Find newss with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterNewsDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered newss with pagination', type: CreateNewsDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  
    @Query('pageSize') pageSize: number = 10,    
    @Body() filterNewsDto: FilterNewsDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { newss, count } = await this.newsService.findPage(pageIndex, pageSize, filterNewsDto);
      const totalPage = Math.ceil(count / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: count,
        totalPage: totalPage,  		
      };
      const response = this.responseService.responseOkWithPagination(newss, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'newss',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update News success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'newss',
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
