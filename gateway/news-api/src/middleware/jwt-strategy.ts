import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { authConstants } from './auth.constants';
// import { PayloadType } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "celestial",
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userOid,
      email: payload.username,
      // artistId: payload.artistId,
    };
  }
}