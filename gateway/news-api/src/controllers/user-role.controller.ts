import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common'; 
import { ResponseService } from '../common/build.response';
import express from 'express';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRoleService } from '../services/user-role.service';
 
@Controller('userRole')
@ApiBearerAuth()
@ApiTags('UserRole')
// @UseGuards(JwtAuthGuard)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService, private readonly responseService: ResponseService,) { }
 

  @UseGuards(AdminRoleGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new UserRole' })
  @ApiBody({ type: CreateUserRoleDto })  // Document the body DTO used for creation
  @ApiOkResponse({ description: 'The userRole has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createUserRoleDto: CreateUserRoleDto, @Request() req: any, @Res() res: express.Response): Promise<any> {
    try {
      // const userOid = res.locals.userOid || res.locals.user?.oid;  // If you attached the full user object, use user.oid
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid
      const userRoleResponse = await this.userRoleService.create(createUserRoleDto, userOid);
      const response = this.responseService.responseOk(userRoleResponse, 1);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
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
  async update(@Param('oid') oid: string, @Body() updateUserRoleDto: UpdateUserRoleDto, @Request() req: any,@Res() res: express.Response): Promise<any> {
    try {
      const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
      const userRoleResponse = await this.userRoleService.update(oid, updateUserRoleDto,userOid);
      const response = this.responseService.responseOk(userRoleResponse, 1);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
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
  async deleted(@Param('oid') oid: string, @Res() res: express.Response): Promise<any> {    
    try {
      const userRoleResponse = await this.userRoleService.deleted(oid);;
      const response = this.responseService.responseOk(userRoleResponse, 1);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AdminRoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all userRoles' })
  @ApiOkResponse({ description: 'List of all userRoles', type: [CreateUserRoleDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Res() res: express.Response): Promise<any> {
    try {
      const userRoles = await this.userRoleService.findAll();
      const response = this.responseService.responseOk(userRoles, userRoles.length);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

  @UseGuards(AdminRoleGuard)
  @Get(':oid')
  @ApiOperation({ summary: 'Get a specific userRole by OID' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the userRole to retrieve' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The userRole details', type: CreateUserRoleDto })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('oid') oid: string, @Res() res: express.Response): Promise<any> {
    // return this.userRoleService.findById(oid);
    try {
      const userRole = await this.userRoleService.findById(oid);;
      const response = this.responseService.responseOk(userRole, 1);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
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
    @Body() filterUserRoleDto: FilterUserRoleDto, @Res() res: express.Response): Promise<any> {
    try {

      const { userRoles, count } = await this.userRoleService.findPage(pageIndex, pageSize, filterUserRoleDto);
      const totalPage = Math.ceil(count / pageSize);

      const pagging = {
        page: pageIndex,
        size: pageSize,
        totalItem: count,
        totalPage: totalPage, // Correctly calculates total pages			
      };
      const response = this.responseService.responseOkWithPagination(userRoles, pagging);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
