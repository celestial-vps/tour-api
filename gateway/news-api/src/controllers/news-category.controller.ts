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
import { NewsCategoryService } from '../services/news-category.service';
import {
  CreateNewsCategoryDto,
  FilterNewsCategoryDto,
  UpdateNewsCategoryDto,
  SuccessNewsCategoryObjectResponseDto,
  SuccessNewsCategoryPaginatedResponseDto,
  SuccessNewsCategoryResponseDto,
} from '../dtos/payload-news-category-dto';
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
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard'; 
import { ErrorResponseDto } from '../dtos/base/error-response.dto';
import { SuccessResponseMessageDto } from '../dtos/base/success-response-message-dto';
import { RequestHandlerService } from '../services/request-handler.service';

@ApiBearerAuth()
@ApiTags('News Category')
@Controller('news-category')
export class NewsCategoryController {
  constructor(
    private readonly newsCategoryService: NewsCategoryService,
    private readonly requestHandler: RequestHandlerService,
  ) { }


  // ---------------- CREATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new NewsCategory' })
  @ApiBody({ type: CreateNewsCategoryDto })
  @ApiOkResponse({ description: 'Create newsCategorys', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createNewsCategoryDto: CreateNewsCategoryDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.newsCategoryService.create(createNewsCategoryDto, userOid),
      {
        action: 'CREATE',
        tableName: 'news_categories',
        userOid,
        req,
        successMessage: 'Create News Category success',
      },
    );

  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a NewsCategory' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the newsCategory to be updated' })
  @ApiBody({ type: UpdateNewsCategoryDto })
  @ApiOkResponse({ description: 'Update newsCategorys', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateNewsCategoryDto: UpdateNewsCategoryDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.newsCategoryService.update(oid, updateNewsCategoryDto, userOid),
      {
        action: 'UPDATE',
        tableName: 'news_categories',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Update News Category success',
      },
    );

  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete('/delete/:oid')
  @ApiOperation({ summary: 'Delete a NewsCategory' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the newsCategory to be deleted' })
  @ApiOkResponse({ description: 'Delete newsCategorys', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.newsCategoryService.deleted(oid, userOid),
      {
        action: 'DELETE',
        tableName: 'news_categories',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Delete News Category success',
      },
    );

  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all newsCategorys' })
  @ApiOkResponse({ description: 'Get all newsCategorys', type: SuccessNewsCategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.newsCategoryService.findAll(),
      {
        action: 'READ',
        tableName: 'news_categories',
        userOid,
        req,
        successMessage: 'Get all News Categories success',
      },
    );

  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific newsCategory by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the newsCategory to retrieve' })
  @ApiOkResponse({ description: 'Get newsCategory', type: SuccessNewsCategoryObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.newsCategoryService.findById(oid),
      {
        action: 'READ',
        tableName: 'news_categories',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Get News Category success',
      },
    );

  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find newsCategorys with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterNewsCategoryDto })
  @ApiOkResponse({ description: 'Get paginated newsCategorys', type: SuccessNewsCategoryPaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterNewsCategoryDto: FilterNewsCategoryDto,
    @Request() req: any,
  ): Promise<any> {
    const userOid = req.user?.oid;

    const page = Number(pageIndex) || 1;
    const size = Number(pageSize) || 10;

    return this.requestHandler.handleRequest(
      async () => {
        const { newsCategories, count } = await this.newsCategoryService.findPage(page, size, filterNewsCategoryDto);
        return {
          page,
          size,
          totalItem: count,
          totalPage: Math.ceil(count / size),
          data: newsCategories,
        };
      },
      {
        action: 'READ',
        tableName: 'news_categories',
        userOid,
        req,
        paginate: true,
        successMessage: 'Get paginated News Categories success',
      },
    );

  }
}
