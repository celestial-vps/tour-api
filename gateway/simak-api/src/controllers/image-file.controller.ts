import { Controller, Get, Post, Body, Param, Put, Delete, Request, BadRequestException, Res, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageFileService } from '../services/image-file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../common/build.response';
import { JwtAuthGuard } from '../middleware/jwt-guard';
import { SystemRoleGuard } from '../middleware/guards/viewer-role.guard';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { CreateImageFileDto, FilterImageFileDto, UpdateImageFileDto } from '../dtos/payload-image-file-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('imageFile')
@ApiBearerAuth()
@ApiTags('ImageFile')
export class ImageFileController {
    constructor(private readonly imageFileService: ImageFileService, private readonly responseService: ResponseService, private readonly auditTrailService: AuditTrailService,) { }

    @UseGuards(JwtAuthGuard, SystemRoleGuard)
    @Post('create')
    @ApiConsumes('multipart/form-data') // <- ini wajib!
    @ApiOperation({ summary: 'Create a new ImageFile' })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './publics',
            filename: (req, file, cb) => {
                const filename = `${uuidv4()}-${file.originalname}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    }))

    @ApiBody({ type: CreateImageFileDto })
    @ApiOkResponse({ description: 'The imageFile has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async create(@UploadedFile() file: Express.Multer.File, @Body() createImageFileDto: CreateImageFileDto, @Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;  // userId sesuai payload di JwtStrategy validate()
            const imageFileResponse = await this.imageFileService.create(file, createImageFileDto, userOid);
            const response = this.responseService.responseOk(imageFileResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: imageFileResponse ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: imageFileResponse,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    @ApiOperation({ summary: 'Update a ImageFile' })
    @ApiParam({ name: 'oid', description: 'Unique identifier of the imageFile to be updated' })  // Document the OID parameter
    @ApiBody({ type: UpdateImageFileDto })  // Document the body DTO used for updating
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'File yang akan diupload' },
                fileName: { type: 'string', description: 'Nama file' },
                fileUrl: { type: 'string', description: 'URL file' },
                filePath: { type: 'string', description: 'Path file di server' },
                fileMime: { type: 'string', description: 'MIME type' },
                ownerType: {
                    type: 'string',
                    description: 'Tipe pemilik file',
                    enum: ['news', 'user', 'category', 'other'],
                },
                userInserted: { type: 'string', description: 'UUID user yang upload' },
            },
            required: ['file', 'fileName', 'ownerType', 'userInserted'], // sesuaikan required fields
        },
    })
    // @ApiOkResponse({ description: 'The imageFile has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async update(@Param('oid') oid: string, @Body() updateImageFileDto: UpdateImageFileDto, @Request() req: any): Promise<any> {
        try {
            const userOid = req.userOid || req.user?.oid;  // If you attached the full user object, use req.user.oid 
            const imageFileResponse = await this.imageFileService.update(oid, updateImageFileDto, userOid);
            const response = this.responseService.responseOk(imageFileResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: imageFileResponse ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: imageFileResponse,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    @ApiOperation({ summary: 'Delete a ImageFile' })
    @ApiParam({ name: 'oid', description: 'Unique identifier of the imageFile to be deleted' })  // Document the OID parameter
    @ApiOkResponse({ description: 'The imageFile has been successfully deleted.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Delete('/delete/:oid')
    async deleted(@Param('oid') oid: string, @Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;
            const imageFileResponse = await this.imageFileService.deleted(oid,userOid);;
            const response = this.responseService.responseOk(imageFileResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: imageFileResponse ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: imageFileResponse,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    @ApiOperation({ summary: 'Get all imageFiles' })
    @ApiOkResponse({ description: 'List of all imageFiles', type: [CreateImageFileDto] })  // Document the response type
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async findAll(@Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;
            const imageFiles = await this.imageFileService.findAll();

            const response = this.responseService.responseOk(imageFiles.imageFiles, imageFiles.imageFiles?.length ?? 0);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    @ApiOperation({ summary: 'Get a specific imageFile by OID' })
    @ApiParam({ name: 'oid', description: 'Unique identifier of the imageFile to retrieve' })  // Document the OID parameter
    @ApiOkResponse({ description: 'The imageFile details', type: CreateImageFileDto })  // Document the response type
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async findOne(@Param('oid') oid: string, @Request() req: any): Promise<any> {

        try {
            const userOid = req.user?.oid;
            const imageFile = await this.imageFileService.findById(oid);;
            const response = this.responseService.responseOk(imageFile, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    @ApiOperation({ summary: 'Find imageFiles with pagination and filters' })
    @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' })  // Document the pageIndex query parameter
    @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' })  // Document the pageSize query parameter
    @ApiBody({ type: FilterImageFileDto })  // Document the filter criteria used in the body
    @ApiOkResponse({ description: 'List of filtered imageFiles with pagination', type: CreateImageFileDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async find(@Query('pageIndex') pageIndex: number = 1,  // Get pageIndex query param
        @Query('pageSize') pageSize: number = 10,   // Get pageSize query param    
        @Body() filterImageFileDto: FilterImageFileDto,
        @Request() req: any): Promise<any> {
        try {
            const userOid = req.user?.oid;
            const { imageFiles, total } = await this.imageFileService.findPage(filterImageFileDto,pageIndex, pageSize );
            const totalPage = Math.ceil(total / pageSize);

            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage, // Correctly calculates total pages			
            };
            const response = this.responseService.responseOkWithPagination(imageFiles, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        } catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
