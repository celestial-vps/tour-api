import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  BadRequestException,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { TagService } from '../services/tag.service';
import {
  CreateTagDto,
  FilterTagDto,
  UpdateTagDto,
  SuccessTagObjectResponseDto,
  SuccessTagPaginatedResponseDto,
  SuccessTagResponseDto,
} from '../dtos/payload-tag-dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { ErrorResponseDto } from '../dtos/base/error-response.dto';
import { SuccessResponseMessageDto } from '../dtos/base/success-response-message-dto';

@ApiBearerAuth()
@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly responseService: ResponseService,
    private readonly auditTrailService: AuditTrailService,
  ) { }

  // ---------------- HELPER FUNCTION ----------------
  private async handleRequest(
    fn: () => Promise<any>,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ',
    userOid: string,
    recordOid?: string,
    req?: any,
    paginate?: boolean,
  ) {
    try {
      const result = await fn();

      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: `${action} Tag success`,
        userOid,
        ipAddress: req?.ip,
        userAgent: req?.headers['user-agent'],
        newData: result,
      });
      if (paginate) {
        return this.responseService.responseOkWithPagination(result.data, {
          page: result.page,
          size: result.size,
          totalItem: result.totalItem,
          totalPage: result.totalPage,
        });
      }


      return this.responseService.responseOk(result, Array.isArray(result) ? result.length : 1);
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'tags',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'ERROR',
        message: error.message,
        userOid,
        ipAddress: req?.ip,
        userAgent: req?.headers['user-agent'],
      });

      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException({ code: 400, status: 400, message: error.message });
    }
  }

  // ---------------- CREATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiOkResponse({ description: 'Create tags', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createTagDto: CreateTagDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.tagService.create(createTagDto, userOid), 'CREATE', userOid, undefined, req);
  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a Tag' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to be updated' })
  @ApiBody({ type: UpdateTagDto })
  @ApiOkResponse({ description: 'Update tags', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateTagDto: UpdateTagDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.tagService.update(oid, updateTagDto, userOid), 'UPDATE', userOid, oid, req);
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':oid')
  @ApiOperation({ summary: 'Delete a Tag' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to be deleted' })
  @ApiOkResponse({ description: 'Delete tags', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.tagService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'Get all tags', type: SuccessTagResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.tagService.findAll(), 'READ', userOid, undefined, req);
  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific tag by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to retrieve' })
  @ApiOkResponse({ description: 'Get tag', type: SuccessTagObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.tagService.findById(oid), 'READ', userOid, oid, req);
  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find tags with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterTagDto })
  @ApiOkResponse({ description: 'Get paginated tags', type: SuccessTagPaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterTagDto: FilterTagDto,
    @Request() req: any,
  ): Promise<any> {
    const userOid = req.user?.oid;

    const page = Number(pageIndex) || 1;
    const size = Number(pageSize) || 10;

    return this.handleRequest(
      async () => {
        const { tags, count } = await this.tagService.findPage(page, size, filterTagDto);
        const totalPage = Math.ceil(count / size);
       
        return {  
          page,   
          size,
          totalItem: count,
          totalPage,
          data: tags,
        };
      },
      'READ',
      userOid,
      undefined,
      req,
      true,
    );
  }
}
