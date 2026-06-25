import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: (req: Request) =>
        req?.cookies?.access_token ?? ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: { select: { id: true, name: true } },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
