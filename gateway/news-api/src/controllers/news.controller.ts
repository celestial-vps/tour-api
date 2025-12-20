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
import { NewsService } from '../services/news.service';
import {
  CreateNewsDto,
  FilterNewsDto,
  UpdateNewsDto,
  SuccessNewsObjectResponseDto,
  SuccessNewsPaginatedResponseDto,
  SuccessNewsResponseDto,
} from '../dtos/payload-news-dto';
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
@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
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
        tableName: 'newss',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: `${action} News success`,
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
        tableName: 'newss',
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
  @ApiOperation({ summary: 'Create a new News' })
  @ApiBody({ type: CreateNewsDto })
  @ApiOkResponse({ description: 'Create newss', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createNewsDto: CreateNewsDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.newsService.create(createNewsDto, userOid), 'CREATE', userOid, undefined, req);
  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a News' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the news to be updated' })
  @ApiBody({ type: UpdateNewsDto })
  @ApiOkResponse({ description: 'Update newss', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateNewsDto: UpdateNewsDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.newsService.update(oid, updateNewsDto, userOid), 'UPDATE', userOid, oid, req);
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':oid')
  @ApiOperation({ summary: 'Delete a News' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the news to be deleted' })
  @ApiOkResponse({ description: 'Delete newss', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.newsService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all newss' })
  @ApiOkResponse({ description: 'Get all newss', type: SuccessNewsResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.newsService.findAll(), 'READ', userOid, undefined, req);
  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific news by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the news to retrieve' })
  @ApiOkResponse({ description: 'Get news', type: SuccessNewsObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.newsService.findById(oid), 'READ', userOid, oid, req);
  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find newss with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterNewsDto })
  @ApiOkResponse({ description: 'Get paginated newss', type: SuccessNewsPaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterNewsDto: FilterNewsDto,
    @Request() req: any,
  ): Promise<any> {
    const userOid = req.user?.oid;

    const page = Number(pageIndex) || 1;
    const size = Number(pageSize) || 10;

    return this.handleRequest(
      async () => {
        const { newss, count } = await this.newsService.findPage(page, size, filterNewsDto);
        const totalPage = Math.ceil(count / size);
       
        return {  
          page,   
          size,
          totalItem: count,
          totalPage,
          data: newss,
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
