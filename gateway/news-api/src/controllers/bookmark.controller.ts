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
import { BookmarkService } from '../services/bookmark.service';
import {
  CreateBookmarkDto,
  FilterBookmarkDto,
  UpdateBookmarkDto,
  SuccessBookmarkObjectResponseDto,
  SuccessBookmarkPaginatedResponseDto,
  SuccessBookmarkResponseDto,
} from '../dtos/payload-bookmark-dto';
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
@ApiTags('Bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
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
        tableName: 'bookmarks',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: `${action} Bookmark success`,
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
        tableName: 'bookmarks',
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
  @ApiOperation({ summary: 'Create a new Bookmark' })
  @ApiBody({ type: CreateBookmarkDto })
  @ApiOkResponse({ description: 'Create bookmarks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createBookmarkDto: CreateBookmarkDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bookmarkService.create(createBookmarkDto, userOid), 'CREATE', userOid, undefined, req);
  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a Bookmark' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bookmark to be updated' })
  @ApiBody({ type: UpdateBookmarkDto })
  @ApiOkResponse({ description: 'Update bookmarks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateBookmarkDto: UpdateBookmarkDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bookmarkService.update(oid, updateBookmarkDto, userOid), 'UPDATE', userOid, oid, req);
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':oid')
  @ApiOperation({ summary: 'Delete a Bookmark' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bookmark to be deleted' })
  @ApiOkResponse({ description: 'Delete bookmarks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bookmarkService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all bookmarks' })
  @ApiOkResponse({ description: 'Get all bookmarks', type: SuccessBookmarkResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bookmarkService.findAll(), 'READ', userOid, undefined, req);
  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific bookmark by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bookmark to retrieve' })
  @ApiOkResponse({ description: 'Get bookmark', type: SuccessBookmarkObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bookmarkService.findById(oid), 'READ', userOid, oid, req);
  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find bookmarks with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterBookmarkDto })
  @ApiOkResponse({ description: 'Get paginated bookmarks', type: SuccessBookmarkPaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterBookmarkDto: FilterBookmarkDto,
    @Request() req: any,
  ): Promise<any> {
    const userOid = req.user?.oid;

    const page = Number(pageIndex) || 1;
    const size = Number(pageSize) || 10;

    return this.handleRequest(
      async () => {
        const { bookmarks, count } = await this.bookmarkService.findPage(page, size, filterBookmarkDto);
        const totalPage = Math.ceil(count / size);
       
        return {  
          page,   
          size,
          totalItem: count,
          totalPage,
          data: bookmarks,
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
