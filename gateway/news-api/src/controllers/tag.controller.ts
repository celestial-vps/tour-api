import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Controller('tag')
@ApiBearerAuth()
@ApiTags('Tag')
export class TagController {
  constructor(private readonly tagService: TagService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Tag' })
  @ApiBody({ type: CreateTagDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The tag has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createTagDto: CreateTagDto, @Request() req: any): Promise<any> {
    try {      
      const userOid = req.user?.oid;   
      const tagResponse = await this.tagService.create(createTagDto, userOid);
      const response = this.responseService.responseOk(tagResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: tagResponse?.value ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Tag success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: tagResponse,
      });
      return response;  
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'tags',
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
  @ApiOperation({ summary: 'Update a Tag' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to be updated' })   
  @ApiBody({ type: UpdateTagDto })   
  @ApiOkResponse({ description: 'The tag has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateTagDto: UpdateTagDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;   
      const tagResponse = await this.tagService.update(oid, updateTagDto, userOid);
      const response = this.responseService.responseOk(tagResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: tagResponse?.value ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Tag success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: tagResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'tags',
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
  @ApiOperation({ summary: 'Delete a Tag' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to be deleted' })   
  @ApiOkResponse({ description: 'The tag has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const tagResponse = await this.tagService.deleted(oid,userOid);;
      const response = this.responseService.responseOk(tagResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: tagResponse?.value ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Tag success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: tagResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'tags',
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
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'List of all tags', type: [CreateTagDto] })   
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const tags = await this.tagService.findAll();

      const response = this.responseService.responseOk(tags, tags.length);
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Tag success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
     await this.auditTrailService.recordPost({
        tableName: 'tags',
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
  @ApiOperation({ summary: 'Get a specific tag by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to retrieve' })  
  @ApiOkResponse({ description: 'The tag details', type: CreateTagDto })   
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const tag = await this.tagService.findById(oid);;
      const response = this.responseService.responseOk(tag, 1);
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Tag success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'tags',
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
  @ApiOperation({ summary: 'Find tags with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })   
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })   
  @ApiBody({ type: FilterTagDto })   
  @ApiOkResponse({ description: 'List of filtered tags with pagination', type: CreateTagDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,    
    @Body() filterTagDto: FilterTagDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { tags, count } = await this.tagService.findPage(pageIndex, pageSize, filterTagDto);
      const totalPage = Math.ceil(count / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: count,
        totalPage: totalPage,  			
      };
      const response = this.responseService.responseOkWithPagination(tags, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Tag success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'tags',
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
