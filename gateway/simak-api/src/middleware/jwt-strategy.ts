import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('SECREATKEY'), // harus sesuai env
    });
  }

  async validate(payload: any) {
    // Ini yang nanti masuk ke request.user
    return {
      userId: payload.userOid,
      username: payload.username,
      role: payload.role,
    };
  }
}
