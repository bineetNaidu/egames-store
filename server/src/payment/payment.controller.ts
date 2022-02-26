import {
  Controller,
  Post,
  Req,
  Param,
  ParseIntPipe,
  Response,
  Request,
  Res,
  Body,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { PaymentService } from './payment.service';

@Controller('/game/:id/purchase')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/')
  async createPaymentOrFail(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreatePaymentDto,
  ) {
    return await this.paymentService.createPaymentOrFail(id, data, {
      req,
      res,
    });
  }
}
