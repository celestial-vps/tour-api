import { Controller, Post, Body, BadRequestException, Res } from '@nestjs/common';
import { ResponseService } from '../common/build.response';
import express from 'express';
import { LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, 
    private readonly responseService: ResponseService
    ) { }
 
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: express.Response): Promise<any> {
    try {
      const userResponse = await this.authService.register(registerDto);
      const response = this.responseService.responseOk(userResponse, 1);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: express.Response): Promise<any> {
    try {
      const userResponse = await this.authService.login(loginDto);
      const response = this.responseService.responseOk(userResponse, 1);
      return res.status(200).json(response);  // Return JSON response with status 200
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
 
}
