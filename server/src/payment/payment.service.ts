import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  Request,
  Response,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { CreatePaymentDto } from './dto/createPayment.dto';

interface ResNReqObj {
  req: Request;
  res: Response;
}

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async createPaymentOrFail(
    gameId: number,
    data: CreatePaymentDto,
    obj: ResNReqObj,
  ) {
    const token = obj.req.headers['x-access-token'] as string;

    if (!token) {
      throw new UnauthorizedException({
        message: 'Not Authenticated',
        field: 'token',
      });
    }

    const payload = this.jwtService.decode(token) as User;

    const authUser = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!authUser) {
      throw new NotFoundException({
        message: 'User not found',
        field: 'user',
      });
    }

    const game = await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw new NotFoundException({
        message: 'Game not found',
        field: 'game',
      });
    }

    if (!game.is_available) {
      throw new HttpException(
        {
          message: 'Game is not available',
          field: 'game',
        },
        400,
      );
    }

    await this.prisma.purchase.create({
      data: {
        user: {
          connect: {
            id: authUser.id,
          },
        },
        game: {
          connect: {
            id: game.id,
          },
        },
        stripe_session_id: data.sessionId,
        amount: data.amount,
        purchase_status: data.status,
      },
    });

    return {
      transaction_complete: true,
      message: 'Payment was Successful',
    };
  }
}
