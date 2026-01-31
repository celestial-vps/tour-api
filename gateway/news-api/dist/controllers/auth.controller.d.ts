import { ResponseService } from '../common/build.response';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/payload-user-dto';
export declare class AuthController {
    private readonly authService;
    private readonly responseService;
    constructor(authService: AuthService, responseService: ResponseService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
}
