import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { SystemRoleGuard } from '../middleware/guards/viewer-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { GeoCacheCountryService } from '../services/geo-cache-country.service';
import { CreateCountryDto, UpdateCountryDto } from '../dtos/payload-country-dto';

@Controller('country')
@ApiBearerAuth()
@ApiTags('Country')
export class CountryController {
  constructor(private readonly geoCacheCountryService: GeoCacheCountryService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }


  // @UseGuards(JwtAuthGuard, SystemRoleGuard)
  // @Post('create')
  // @ApiOperation({ summary: 'Create a new Country' })
  // @ApiBody({ type: CreateCountryDto })
  // @ApiOkResponse({ description: 'The country has been successfully created.' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async create(@Body() createCountryDto: CreateCountryDto, @Request() req: any): Promise<any> {
  //   try {
  //     const userOid = req.user?.oid;
  //     const countryResponse = await this.geoCacheCountryService.upsertCountry(createCountryDto);
  //     const response = this.responseService.responseOk(countryResponse, 1);
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'CREATE',
  //       status: 'SUCCESS',
  //       message: 'Create Country success',
  //       userOid: userOid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //       newData: countryResponse,
  //     });
  //     return response;
  //   } catch (error) {
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'CREATE',
  //       status: 'ERROR',
  //       message: error.message,
  //       userOid: req.user?.oid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //     });
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @UseGuards(JwtAuthGuard, SystemRoleGuard)
  // @Put(':oid')
  // @ApiOperation({ summary: 'Update a Country' })
  // @ApiParam({ name: 'oid', description: 'Unique identifier of the country to be updated' })
  // @ApiBody({ type: UpdateCountryDto })
  // @ApiOkResponse({ description: 'The country has been successfully updated.' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async update(@Param('oid') oid: string, @Body() updateCountryDto: UpdateCountryDto, @Request() req: any): Promise<any> {
  //   try {
  //     const userOid = req.userOid || req.user?.oid;
  //     const countryResponse = await this.geoCacheCountryService.upsertCountry(oid, updateCountryDto, userOid);
  //     const response = this.responseService.responseOk(countryResponse, 1);
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'UPDATE',
  //       status: 'SUCCESS',
  //       message: 'Update Country success',
  //       userOid: userOid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //       newData: countryResponse,
  //     });
  //     return response;
  //   } catch (error) {
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'UPDATE',
  //       status: 'ERROR',
  //       message: error.message,
  //       userOid: req.user?.oid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //     });
  //     throw new BadRequestException(error.message);
  //   }
  // }

  @UseGuards(JwtAuthGuard, SystemRoleGuard)
  @ApiOperation({ summary: 'Delete a Country' })
  @ApiParam({ name: 'oid', description: 'Unique identifier of the country to be deleted' })  // Document the OID parameter
  @ApiOkResponse({ description: 'The country has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/delete/:oid')
  async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const countryResponse = await this.geoCacheCountryService.deleteCountry(oid);;
      const response = this.responseService.responseOk(countryResponse, 1);
      await this.auditTrailService.recordPost({
        tableName: 'countries',
        recordOid: 'unknown',
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Update Country success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: countryResponse,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'countries',
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
  @ApiOperation({ summary: 'Get all countries' })
  @ApiOkResponse({ description: 'List of all countries', type: [CreateCountryDto] })  // Document the response type
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Request() req: any): Promise<any> {
    try {
      const userOid = req.user?.oid;
      const countries = await this.geoCacheCountryService.getCountries();

      const response = this.responseService.responseOk(countries, countries.length);
      await this.auditTrailService.recordPost({
        tableName: 'countries',
        recordOid: 'unknown',
        action: 'READ',
        status: 'SUCCESS',
        message: 'Update Country success',
        userOid: userOid,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        newData: response,
      });
      return response;
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'countries',
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

  // @UseGuards(JwtAuthGuard, SystemRoleGuard)
  // @Get(':oid')
  // @ApiOperation({ summary: 'Get a specific country by OID' })
  // @ApiParam({ name: 'oid', description: 'Unique identifier of the country to retrieve' })  // Document the OID parameter
  // @ApiOkResponse({ description: 'The country details', type: CreateCountryDto })  // Document the response type
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

  //   try {
  //     const userOid = req.user?.oid;
  //     const country = await this.geoCacheCountryService.findById(oid);;
  //     const response = this.responseService.responseOk(country, 1);
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'READ',
  //       status: 'SUCCESS',
  //       message: 'Update Country success',
  //       userOid: userOid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //       newData: response,
  //     });
  //     return response;
  //   } catch (error) {
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'READ',
  //       status: 'ERROR',
  //       message: error.message,
  //       userOid: req.user?.oid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //     });
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // @UseGuards(JwtAuthGuard, SystemRoleGuard)
  // @Post('/q')
  // @ApiOperation({ summary: 'Find countries with pagination and filters' })
  // @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
  // @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
  // @ApiBody({ type: FilterCountryDto })  // Document the filter criteria used in the body
  // @ApiOkResponse({ description: 'List of filtered countries with pagination', type: CreateCountryDto })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async find(@Query('pageIndex') pageIndex: number = 1,  
  //   @Query('pageSize') pageSize: number = 10,    
  //   @Body() filterCountryDto: FilterCountryDto,
  //   @Request() req: any): Promise<any> {
  //   try {
  //     const userOid = req.user?.oid;
  //     const { countries, count } = await this.geoCacheCountryService.findPage(pageIndex, pageSize, filterCountryDto);
  //     const totalPage = Math.ceil(count / pageSize);

  //     const pagging = {
  //       page: pageIndex,
  //       size: pageSize,
  //       totalItem: count,
  //       totalPage: totalPage,  		
  //     };
  //     const response = this.responseService.responseOkWithPagination(countries, pagging);
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'READ',
  //       status: 'SUCCESS',
  //       message: 'Update Country success',
  //       userOid: userOid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //       newData: response,
  //     });
  //     return response;
  //   } catch (error) {
  //     await this.auditTrailService.recordPost({
  //       tableName: 'countries',
  //       recordOid: 'unknown',
  //       action: 'READ',
  //       status: 'ERROR',
  //       message: error.message,
  //       userOid: req.user?.oid,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //     });
  //     throw new BadRequestException(error.message);
  //   }
  // }

}
