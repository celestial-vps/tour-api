import { ResponseService } from '../common/build.response';
import { LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly responseService;
    constructor(authService: AuthService, responseService: ResponseService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
}
