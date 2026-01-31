import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  Query,
  UseGuards,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { ErrorResponseDto } from '../dtos/base/error-response.dto';
import { SuccessResponseMessageDto } from '../dtos/base/success-response-message-dto';
import { RequestHandlerService } from '../services/request-handler.service';

@ApiBearerAuth()
@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
  private readonly requestHandler: RequestHandlerService,
  ) { }

   
  // ---------------- CREATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiOkResponse({ description: 'Create tags', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createTagDto: CreateTagDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
       return this.requestHandler.handleRequest(
      () => this.tagService.create(createTagDto, userOid),
      {
        action: 'CREATE',
        tableName: 'tags',
        userOid,
        req,
        successMessage: 'Create Tag success',
      },
    );
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
       return this.requestHandler.handleRequest(
      () => this.tagService.update(oid, updateTagDto, userOid),
      {
        action: 'UPDATE',
        tableName: 'tags',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Update Tag success',
      },
    );
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete('/delete/:oid')
  @ApiOperation({ summary: 'Delete a Tag' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the tag to be deleted' })
  @ApiOkResponse({ description: 'Delete tags', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(
      () => this.tagService.deleted(oid, userOid),
      {
        action: 'DELETE',
        tableName: 'tags',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Delete Tag success',
      },
    );
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'Get all tags', type: SuccessTagResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
       return this.requestHandler.handleRequest(
      () => this.tagService.findAll(),
      {
        action: 'READ',
        tableName: 'tags',
        userOid,
        req,
      },
    );
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
       return this.requestHandler.handleRequest(
      () => this.tagService.findById(oid),
      {
        action: 'READ',
        tableName: 'tags',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Get Tag success',
      },
    );
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

    return this.requestHandler.handleRequest(
      async () => {
        const { tags, count } = await this.tagService.findPage(page, size, filterTagDto);
        return {
          page,
          size,
          totalItem: count,
          totalPage: Math.ceil(count / size),
          data: tags,
        };
      },
      {
        action: 'READ',
        tableName: 'tags',
        userOid,
        req,
        paginate: true,
        successMessage: 'Get paginated tags success',
      },
    );
  }
}
