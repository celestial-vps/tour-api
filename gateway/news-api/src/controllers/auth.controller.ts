import { Controller, Post, Body, BadRequestException, Req } from '@nestjs/common';
import { ResponseService } from '../common/build.response';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication') // Group di Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'Payload to register a new user' })
  @ApiOkResponse({ description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    try {
      const userResponse = await this.authService.register(registerDto);
      return this.responseService.responseOk(userResponse, 1);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto, description: 'Payload to login' })
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const userResponse = await this.authService.login(loginDto);
      return this.responseService.responseOk(userResponse, 1);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
