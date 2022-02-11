import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'] as string;
    if (token) {
      const isAuthed = this.jwtService.verify(token);
      console.log(isAuthed);
      next();
    } else {
      throw new UnauthorizedException(
        {
          errors: [
            {
              field: 'token',
              message: 'Token is required',
            },
          ],
        },
        'Token is required',
      );
    }
  }
}
