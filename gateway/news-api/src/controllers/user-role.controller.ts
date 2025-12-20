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
import { UserRoleService } from '../services/user-role.service';
import {
  CreateUserRoleDto,
  FilterUserRoleDto,
  UpdateUserRoleDto,
  SuccessUserRoleObjectResponseDto,
  SuccessUserRolePaginatedResponseDto,
  SuccessUserRoleResponseDto,
} from '../dtos/payload-user-role-dto';
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
@ApiTags('UserRole')
@Controller('userRole')
export class UserRoleController {
  constructor(
    private readonly userRoleService: UserRoleService,
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
        tableName: 'userRoles',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: `${action} UserRole success`,
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
        tableName: 'userRoles',
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
  @ApiOperation({ summary: 'Create a new UserRole' })
  @ApiBody({ type: CreateUserRoleDto })
  @ApiOkResponse({ description: 'Create userRoles', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async create(@Body() createUserRoleDto: CreateUserRoleDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.userRoleService.create(createUserRoleDto, userOid), 'CREATE', userOid, undefined, req);
  }

  // ---------------- UPDATE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Put(':oid')
  @ApiOperation({ summary: 'Update a UserRole' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to be updated' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse({ description: 'Update userRoles', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async update(@Param('oid') oid: string, @Body() updateUserRoleDto: UpdateUserRoleDto, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.userRoleService.update(oid, updateUserRoleDto, userOid), 'UPDATE', userOid, oid, req);
  }

  // ---------------- DELETE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':oid')
  @ApiOperation({ summary: 'Delete a UserRole' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to be deleted' })
  @ApiOkResponse({ description: 'Delete userRoles', type: SuccessResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.userRoleService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
  }

  // ---------------- FIND ALL ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all userRoles' })
  @ApiOkResponse({ description: 'Get all userRoles', type: SuccessUserRoleResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async findAll(@Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.userRoleService.findAll(), 'READ', userOid, undefined, req);
  }

  // ---------------- FIND ONE ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific userRole by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to retrieve' })
  @ApiOkResponse({ description: 'Get userRole', type: SuccessUserRoleObjectResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    const userOid = req.user?.oid;
    return this.handleRequest(() => this.userRoleService.findById(oid), 'READ', userOid, oid, req);
  }

  // ---------------- FIND WITH PAGINATION ----------------
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('/q')
  @ApiOperation({ summary: 'Find userRoles with pagination and filters' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })
  @ApiBody({ type: FilterUserRoleDto })
  @ApiOkResponse({ description: 'Get paginated userRoles', type: SuccessUserRolePaginatedResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto })
  async find(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Body() filterUserRoleDto: FilterUserRoleDto,
    @Request() req: any,
  ): Promise<any> {
    const userOid = req.user?.oid;

    const page = Number(pageIndex) || 1;
    const size = Number(pageSize) || 10;

    return this.handleRequest(
      async () => {
        const { userRoles, count } = await this.userRoleService.findPage(page, size, filterUserRoleDto);
        const totalPage = Math.ceil(count / size);
       
        return {  
          page,   
          size,
          totalItem: count,
          totalPage,
          data: userRoles,
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
