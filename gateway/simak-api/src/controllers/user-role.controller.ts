import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { ResponseService } from '../common/build.response';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRoleService } from '../services/user-role.service';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Controller('userRole')
@ApiBearerAuth()
@ApiTags('UserRole')
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService, private readonly responseService: ResponseService,
        private readonly auditTrailService: AuditTrailService
    ) { }


    @UseGuards(AdminRoleGuard)
    @Post('create')
    @ApiOperation({ summary: 'Create a new UserRole' })
    @ApiBody({ type: CreateUserRoleDto })
    @ApiOkResponse({ description: 'The userRole has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async create(@Body() createUserRoleDto: CreateUserRoleDto, @Request() req: any): Promise<any> {
        try {
            const userOid = req.userOid || req.user?.oid;
            const userRoleResponse = await this.userRoleService.create(createUserRoleDto, userOid);
            if (userRoleResponse.err) {
                await this.auditTrailService.recordPost({
                    tableName: 'userRoles',
                    recordOid: 'unknown',
                    action: 'CREATE',
                    status: 'ERROR',
                    message: userRoleResponse.err,
                    userOid: req.user?.oid,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                throw new BadRequestException(userRoleResponse.err);
            }
            const response = this.responseService.responseOk(userRoleResponse, 1);

            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: userRoleResponse?.userRole ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: userRoleResponse,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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


    @UseGuards(AdminRoleGuard)
    @Put(':oid')
    @ApiOperation({ summary: 'Update a UserRole' })
    @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to be updated' })  // Document the OID parameter
    @ApiBody({ type: UpdateUserRoleDto })  // Document the body DTO used for updating
    @ApiOkResponse({ description: 'The userRole has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async update(@Param('oid') oid: string, @Body() updateUserRoleDto: UpdateUserRoleDto, @Request() req: any): Promise<any> {
        try {
            const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
            const userRoleResponse = await this.userRoleService.update(oid, updateUserRoleDto, userOid);
            const response = this.responseService.responseOk(userRoleResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: userRoleResponse?.userRole ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: userRoleResponse,
            });
            return response; // Return JSON response with status 200
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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


    @UseGuards(AdminRoleGuard)
    @Delete('/delete/:oid')
    @ApiOperation({ summary: 'Delete a UserRole' })
    @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to be deleted' })  // Document the OID parameter
    @ApiOkResponse({ description: 'The userRole has been successfully deleted.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Delete('/delete/:oid')
    async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;
            const userRoleResponse = await this.userRoleService.deleted(oid, userOid);;
            const response = this.responseService.responseOk(userRoleResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: userRoleResponse?.userRole ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: userRoleResponse,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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

    @UseGuards(AdminRoleGuard)
    @Get()
    @ApiOperation({ summary: 'Get all userRoles' })
    @ApiOkResponse({ description: 'List of all userRoles', type: [CreateUserRoleDto] })  // Document the response type
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async findAll(@Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;
            const userRoles = await this.userRoleService.findAll();
            const response = this.responseService.responseOk(userRoles.userRoles, userRoles.userRoles ? userRoles.userRoles.length : 0);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
                tableName: 'userRoles',
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

    @UseGuards(AdminRoleGuard)
    @Get(':oid')
    @ApiOperation({ summary: 'Get a specific userRole by OID' })
    @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to retrieve' })  // Document the OID parameter
    @ApiOkResponse({ description: 'The userRole details', type: CreateUserRoleDto })  // Document the response type
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {
        // return this.userRoleService.findById(oid);
        try {
            const userOid = req.user?.oid;
            const userRole = await this.userRoleService.findById(oid);;
            const response = this.responseService.responseOk(userRole, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
                tableName: 'userRoles',
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

    @UseGuards(AdminRoleGuard)
    @Post('/q')
    @ApiOperation({ summary: 'Find userRoles with pagination and filters' })
    @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
    @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
    @ApiBody({ type: FilterUserRoleDto })  // Document the filter criteria used in the body
    @ApiOkResponse({ description: 'List of filtered userRoles with pagination', type: CreateUserRoleDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
        @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
        @Body() filterUserRoleDto: FilterUserRoleDto, @Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;
            const { userRoles, total } = await this.userRoleService.findPage(filterUserRoleDto, pageIndex, pageSize);
            const totalPage = Math.ceil(total / pageSize);

            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage, // Correctly calculates total pages			
            };
            const response = this.responseService.responseOkWithPagination(userRoles, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
                tableName: 'userRoles',
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

