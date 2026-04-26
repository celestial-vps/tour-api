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
import { BankService } from '../services/bank.service';
import {
  CreateBankDto,
  FilterBankDto,
  UpdateBankDto,
  SuccessBankObjectResponseDto,
  SuccessBankPaginatedResponseDto,
  SuccessBankResponseDto,
} from '../dtos/payload-bank-dto';
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
import { RequestHandlerService } from '../services/request-handler.service';

@ApiBearerAuth()
@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(
    private readonly bankService: BankService,
    private readonly requestHandler: RequestHandlerService,
  ) { }

  // ---------------- CREATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Bank' })
  @ApiBody({ type: CreateBankDto })
  @ApiOkResponse({ description: 'Create banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createBankDto: CreateBankDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.bankService.create(createBankDto, userOid),
      {
        action: 'CREATE',
        tableName: 'banks',
        userOid,
        req,
        successMessage: 'Create Bank success',
      },
    );
  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be updated' })
  @ApiBody({ type: UpdateBankDto })
  @ApiOkResponse({ description: 'Update banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateBankDto: UpdateBankDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.bankService.update(oid, updateBankDto, userOid),
      {
        action: 'UPDATE',
        tableName: 'banks',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Update Bank success',
      },
    );

  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete('/delete/:oid')
  @ApiOperation({ summary: 'Delete a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be deleted' })
  @ApiOkResponse({ description: 'Delete banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.bankService.deleted(oid, userOid),
      {
        action: 'DELETE',
        tableName: 'banks',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Delete Bank success',
      },
    );

  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiOkResponse({ description: 'Get all banks', type: SuccessBankResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.bankService.findAll(),
      {
        action: 'READ',
        tableName: 'banks',
        userOid,
        req,
      },
    );

  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific bank by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to retrieve' })
  @ApiOkResponse({ description: 'Get bank', type: SuccessBankObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.requestHandler.handleRequest(
      () => this.bankService.findById(oid),
      {
        action: 'READ',
        tableName: 'banks',
        recordOid: oid,
        userOid,
        req,
        successMessage: 'Get Bank success',
      },
    );

  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find banks with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterBankDto })
  @ApiOkResponse({ description: 'Get paginated banks', type: SuccessBankPaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterBankDto: FilterBankDto,
    @Request() req: any,
  ): Promise<any> {
    const userOid = req.user?.oid;

    const page = Number(pageIndex) || 1;
    const size = Number(pageSize) || 10;

    return this.requestHandler.handleRequest(
      async () => {
        const { banks, count } = await this.bankService.findPage(page, size, filterBankDto);
        return {
          page,
          size,
          total: count,
          totalPages: Math.ceil(count / size),
          data: banks,
        };
      },
      {
        action: 'READ',
        tableName: 'banks',
        userOid,
        req,
        paginate: true,
        successMessage: 'Get paginated banks success',
      },
    );

  }
}
