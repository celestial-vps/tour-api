import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { SystemRoleGuard } from '../middleware/guards/viewer-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Controller('bank')
@ApiBearerAuth()
@ApiTags('Bank')
export class BankController {
  constructor(private readonly bankService: BankService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Bank' })
  @ApiBody({ type: CreateBankDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The bank has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createBankDto: CreateBankDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;  // userId sesuai payload di JwtStrategy validate()
      const bankResponse = await this.bankService.create(createBankDto, userOid);
      const response = this.responseService.responseOk(bankResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: bankResponse?.bank ?? 'unknown',
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
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be updated' })  // Document the OID parameter
  @ApiBody({ type: UpdateBankDto })  // Document the body DTO used for updating
  @ApiOkResponse({ description: 'The bank has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async update(@Param('oid') oid: string, @Body() updateBankDto: UpdateBankDto, @Request() req: any): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
      const bankResponse = await this.bankService.update(oid, updateBankDto, userOid);
      const response = this.responseService.responseOk(bankResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: bankResponse?.bank ?? 'unknown',
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
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @ApiOperation({ summary: 'Delete a Bank' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The bank has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const bankResponse = await this.bankService.deleted(oid, userOid);;
      const response = this.responseService.responseOk(bankResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: bankResponse?.bank ?? 'unknown',
        action: 'DELETE',
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
  @ApiOperation({ summary: 'Get all banks' })
  @ApiOkResponse({ description: 'List of all banks', type: [CreateBankDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const banks = await this.bankService.findAll();

      const response = this.responseService.responseOk(banks.banks, banks.banks ? banks.banks.length : 0);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Bank success',
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
      throw new BadRequestException(error.message);
    }

  }

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific bank by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the bank to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The bank details', type: CreateBankDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

    try {
      const userOid = req.user?.oid;
      const bank = await this.bankService.findById(oid);;
      const response = this.responseService.responseOk(bank, 1);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Bank success',
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
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find banks with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  @ApiBody({ type: FilterBankDto })  // Document the filter criteria used in the body
  @ApiOkResponse({ description: 'List of filtered banks with pagination', type: CreateBankDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
    @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
    @Body() filterBankDto: FilterBankDto,
    @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const { banks, total, err } = await this.bankService.findPage(pageIndex, pageSize, filterBankDto);
      const totalPage = Math.ceil(total / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: total,
        totalPage: totalPage, // Correctly calculates total pages			
      };
      const response = this.responseService.responseOkWithPagination(banks, pagging);
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Bank success',
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
      throw new BadRequestException(error.message);
    }
  }

}
