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

@ApiBearerAuth()
@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(
    private readonly bankService: BankService,
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
        tableName: 'banks',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: `${action} Bank success`,
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
        tableName: 'banks',
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
  @ApiOperation({ summary: 'Create a new Bank' })
  @ApiBody({ type: CreateBankDto })
  @ApiOkResponse({ description: 'Create banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createBankDto: CreateBankDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bankService.create(createBankDto, userOid), 'CREATE', userOid, undefined, req);
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
    return this.handleRequest(() => this.bankService.update(oid, updateBankDto, userOid), 'UPDATE', userOid, oid, req);
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':oid')
  @ApiOperation({ summary: 'Delete a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be deleted' })
  @ApiOkResponse({ description: 'Delete banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bankService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiOkResponse({ description: 'Get all banks', type: SuccessBankResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.bankService.findAll(), 'READ', userOid, undefined, req);
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
    return this.handleRequest(() => this.bankService.findById(oid), 'READ', userOid, oid, req);
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

    return this.handleRequest(
      async () => {
        const { banks, count } = await this.bankService.findPage(page, size, filterBankDto);
        const totalPage = Math.ceil(count / size);
       
        return {  
          page,   
          size,
          totalItem: count,
          totalPage,
          data: banks,
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
