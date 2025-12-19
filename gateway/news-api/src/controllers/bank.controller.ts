import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Query, UseGuards } from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { CreateBankDto, FilterBankDto, SuccessBankObjectResponseDto, SuccessBankPaginatedResponseDto, SuccessBankResponseDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';

// Optional: DTO pagination wrapper for Swagger
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { ErrorResponseDto } from '../dtos/base/error-response.dto';
import { SuccessResponseMessageDto } from '../dtos/base/success-response-message-dto';



// @ApiExtraModels( ErrorResponseDto, BankVm, PaginationDto)
@ApiBearerAuth()
@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(
    private readonly bankService: BankService,
    private readonly responseService: ResponseService,
    private readonly auditTrailService: AuditTrailService,
  ) { }

  // ---------------- CREATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Bank' })
  @ApiBody({ type: CreateBankDto })
  @ApiOkResponse({ description: 'Create banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ErrorResponseDto })
  async create(@Body() createBankDto: CreateBankDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const bankResponse = await this.bankService.create(createBankDto, userOid);
      const response = this.responseService.responseOk(bankResponse, 1);

      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: bankResponse?.value ?? 'unknown',
        action: 'CREATE',
        status: 'SUCCESS',
        message: 'Create Bank success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: bankResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'CREATE',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be updated' })
  @ApiBody({ type: UpdateBankDto })
  @ApiOkResponse({ description: 'Update banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateBankDto: UpdateBankDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;
      const bankResponse = await this.bankService.update(oid, updateBankDto, userOid);
      const response = this.responseService.responseOk(bankResponse, 1);

      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: bankResponse?.value ?? 'unknown',
        action: 'UPDATE',
        status: 'SUCCESS',
        message: 'Update Bank success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: bankResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'UPDATE',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete('/delete/:oid')
  @ApiOperation({ summary: 'Delete a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be deleted' })
  @ApiOkResponse({ description: 'Delete banks', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const bankResponse = await this.bankService.deleted(oid, userOid);
      const response = this.responseService.responseOk(bankResponse, 1);

      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: bankResponse?.value ?? 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Delete Bank success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: bankResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'DELETE',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiOkResponse({ description: 'Get all banks', type: SuccessBankResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const banks = await this.bankService.findAll();

      const response = this.responseService.responseOk(banks, banks.length);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Read all banks success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific bank by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to retrieve' })
  @ApiOkResponse({ description: 'Create banks', type: SuccessBankObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const bank = await this.bankService.findById(oid);

      const response = this.responseService.responseOk(bank, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Read bank by OID success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find banks with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterBankDto })
  @ApiOkResponse({ description: 'Get all banks', type: SuccessBankPaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterBankDto: FilterBankDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { banks, count } = await this.bankService.findPage(pageIndex, pageSize, filterBankDto);
      const totalPage = Math.ceil(count / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: count,
        totalPage: totalPage,
        data: banks,
      };

      const response = this.responseService.responseOkWithPagination(pagging, totalPage);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Paginated bank search success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'ERROR',
        message: error.message,
        userOid: req.user?.oid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }
}
